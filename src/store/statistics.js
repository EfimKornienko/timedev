import firebase from 'firebase/app'

import Statistics from './statistics_help'

export default {
  state: {
    stats: []
  },
  mutations: {
    newStat (state, payload) {
      state.stats.unshift(payload)
    },
    loadStat (state, payload) {
      state.stats = payload.reverse()
    }
  },
  actions: {
    async loadStat ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Get task
        const stat = await firebase.database().ref('stats').once('value')
        // Get value
        const stats = stat.val()
        // New array
        const statArray = []
        // Get task key (id)
        Object.keys(stats).forEach(key => {
          const t = stats[key]
          statArray.push(
            new Statistics(
              t.title,
              t.time,
              t.completeDate,
              t.tagUsed,
              t.user,
              key
            )
          )
        })
        // Send mutation
        commit('loadStat', statArray)
        console.log(statArray)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async newStat ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Used helped class
        const newStat = new Statistics(
          payload.title,
          payload.time,
          payload.completeDate,
          payload.tagUsed,
          getters.user.id
        )
        // Push newStat
        const stat = await firebase.database().ref('stats').push(newStat)

        // Send mutation
        commit('newStat', {
          ...newStat,
          id: stat.key
        })
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        console.log('PIZDEC')
        throw error
      }
    },
  },
  getters: {
    stats (state, getters) {
      return state.stats.filter(stat => {
        return stat.user === getters.user.id
      })
    },

  }
}