
import firebase from 'firebase/app'

import Task from './task_help'

export default {
  state: {
    tasks: []
  },
  mutations: {
    loadTasks (state, payload) {
      state.tasks = payload.reverse()
    },
    newTask (state, payload) {
      state.tasks.unshift(payload)
    },
    editTask (state, {id, title, description}) {
      const task = state.tasks.find(t => {
        return t.id === id
      })
      task.title = title
      task.description = description
    },
    completedTask (state, {id, completed, completeDate, beginDate, time}) {
      const task = state.tasks.find(t => {
        return t.id === id
      })
      task.completed = completed
      task.completeDate = completeDate
      task.time = time
      task.beginDate = beginDate
    },
    taskDateFilter (state, {id, sortDate}) {
      const task = state.tasks.find(t => {
        return t.id === id
      })
      task.sortDate = sortDate
    }
  },
  actions: {
    // Load all Tasks
    async loadTasks ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Get task
        const task = await firebase.database().ref('tasks').once('value')
        // Get value
        const tasks = task.val()
        // New array
        const tasksArray = []
        // Get task key (id)
        Object.keys(tasks).forEach(key => {
          const t = tasks[key]
          tasksArray.push(
            new Task(
              t.title,
              t.description,
              t.time,
              t.beginDate,
              t.completeDate,
              t.sortDate,
              t.tags,
              t.completed,
              t.editing,
              t.show,
              t.user,
              key
            )
          )
        })
        // Send mutation
        commit('loadTasks', tasksArray)
        console.log(tasksArray)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    // Create new Task
    async newTask ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Used helped class
        const newTask = new Task(
          payload.title,
          payload.description,
          payload.time,
          payload.beginDate,
          payload.completeDate,
          payload.sortDate,
          payload.tags,
          payload.completed,
          payload.editing,
          payload.show,
          getters.user.id
        )
        // Push newTask
        const task = await firebase.database().ref('tasks').push(newTask)

        // Send mutation
        commit('newTask', {
          ...newTask,
          id: task.key
        })
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        console.log('PIZDEC')
        throw error
      }
    },
    // Edit Task (popup)
    async editTask ({commit}, {id, title, description}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Update title & descr
        await firebase.database().ref('tasks').child(id).update({
          title,
          description
        })
        // Send mutation
        commit('editTask', {id, title, description})

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    // Change Completed
    async completedTask ({commit}, {id, completed, completeDate, beginDate, time}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Update title & descr
        await firebase.database().ref('tasks').child(id).update({
          completed,
          completeDate,
          beginDate,
          time
        })
        // Send mutation
        commit('completedTask', {id, completed, completeDate, beginDate, time})

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async taskFilterDate ({commit}, {id, sortDate}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Update title & descr
        await firebase.database().ref('tasks').child(id).update({
          sortDate
        })
        // Send mutation
        commit('taskDateFilter', {id, sortDate})

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    // Delete Task (button)
    async deleteTask ({commit}, id) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('tasks').child(id).remove()
        console.log('NoRm')
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    // Get All user Tasks
    tasks (state, getters) {
      return state.tasks.filter(task => {
        return task.user === getters.user.id
      })
    },
    // Get user Completed Tasks
    taskCompleted (state, getters) {
      return getters.tasks.filter(task => {
        return task.completed
      })
    },
    // Get user Active Tasks
    taskNotCompleted (state, getters) {
      return getters.tasks.filter(task => {
        return task.completed === false
      })
    }
  }
}
