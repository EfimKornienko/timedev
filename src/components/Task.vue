<template lang="pug">
  .content-wrapper
    section
      .container
        .task-list__header
          h1.ui-title-1 History

          // Filter
          .buttons-list
            .button.button--round.button-default(
              @click="filter = 'active'"
            ) Active
            .button.button--round.button-default(
              @click="filter = 'completed'"
            ) Completed
            .button.button--round.button-default(
              @click="filter = 'all'"
            ) All
            .button.button--round.button-default(
              @click="filter = 'find'"
            ) FindDate
        input.find-date--input(
          type="date"
          placeholder="Choose date?"
          v-model="this.inputDate"
        )
        .button.button-default(
              @click="taskDateFilter(this.task.id, this.task.completed, this.task.beginDate, this.task.sortDate, this.inputDate)"
              ) Send
              span {{inputDateString(this.inputDate)}}

        // Task load
        .task-list
            .task-item(
              v-for="task in tasksFilter"
              :key="task.id"
              :class="{ completed: task.completed }"
            )
              .ui-card(
                v-if='!task.show'
              )         
                .task-item__info
                  .task-item__main-info
                    span(v-if='task.completed').ui-title-4 Spent time {{ timeString(task.time) }}
                    span(v-else).ui-title-4 Added: {{ dateString(task.beginDate) }}
                  span.ui-title-2 {{ task.title }}
                  span.button(
                      @click="task.show = !task.show"
                    )
                    img(src='https://img.icons8.com/metro/26/000000/expand-arrow.png')
              .ui-card(
                v-else='task.show'
                )            
                .task-item__info
                  .task-item__main-info
                    span(v-if='task.completed').ui-title-4 Spent time: {{ timeString(task.time)}}
                    span(v-else).ui-title-4 Added: {{ dateString (task.beginDate) }}
                  .buttons-list
                    span.button(
                        @click="task.show = !task.show"
                      )
                      img(src="https://img.icons8.com/metro/26/000000/chevron-up.png")
                .task-item__content
                  .task-item__header
                    .ui-checkbox-wrapper
                      input.ui-checkbox(
                        type="checkbox"
                        v-model="task.completed"
                        @click="taskCompleted(task.id, task.completed, task.completeDate, task.beginDate, task.time)"
                        v-if="!task.completed"
                      )
                    span.ui-title-2 {{ task.title }}
                  .task-item__body
                    p.ui-text {{ task.description }}
                  .task-item__foter
                    // Tags load
                    .tag-list
                      .ui-tag__wrapper(
                        v-for="tag in task.tags"
                        :key="tag.title"
                      )
                        .ui-tag
                          span.tag-title {{ tag.title }}
                    .time(v-if='task.completed')
                      span Начато:{{dateString (task.beginDate)}}
                      span Закончено:{{dateString (task.completeDate)}}
                      span {{dateArray(task.beginDate)}}

                      // Buttons
                    .buttons-list
                      .button.button--round.button-delete(
                        @click="deleteTask(task.id)"
                      ) Delete
                      .button.button--round.button-default(
                        @click="taskEdit(task.id, task.title, task.description)"
                      ) Edit
                      .button.button--round.button-default(
                        v-if='!task.completed'
                        @click="taskCompleted(task.id, task.completed,task.completeDate, task.beginDate, task.time)"
                      )
                        span.done Done

    // Edit popup
    .ui-messageBox__wrapper(
      v-if="editingPopup"
      @click="cancelTaskEdit"
      :class="{active: editingPopup}"
    )
      .ui-messageBox.fadeInDown(
        @click.stop=""
      )
        .ui-messageBox__header
          span.messageBox-title {{ titleEditing }}
          span.button-close(@click="cancelTaskEdit")
        .ui-messageBox__content
          p Title
          input(
            type="text"
            v-model='titleEditing'
            @keyup.esc="cancelTaskEdit"
          )
          p Description
          textarea(
            type="text"
            v-model='desrEditing'
            @keyup.esc="cancelTaskEdit"
          )
        .ui-messageBox__footer
          .button.button-light(@click="cancelTaskEdit") Cancel
          .button.button-primary(@click="finishTaskEdit") OK

</template>

<script>
export default {
  data () {
    return {
      filter: 'active',
      // Editing
      editingPopup: false,
      titleEditing: '',
      desrEditing: '',
      taskId: null,
      taskMenuShow: false,
      show: true,
      dateTitle: '',
      inputDate: '',
      findDate: false
    }
  },
  methods: {
    // Completed
    taskCompleted (id, completed, completeDate, beginDate, time) {
      if(completed) {
        completed = false
      } else {
        completed = true
        completeDate = new Date(this.nowTime())
        beginDate = new Date(beginDate)
        time = this.nowTime() - time
      }
      this.$store.dispatch('completedTask', {
        id,
        completed,
        completeDate,
        beginDate,
        time
      })
        .then(() => {
          console.log(completed)
        //  this.$store.dispatch('loadTasks')
        })
    },
    taskDateFilter (id, completed, beginDate, sortDate, inputDate) {
      if(completed) {
        beginDate = this.dateArray(beginDate)
        inputDate = this.inputDateString(inputDate)

        if(beginDate = inputDate) {
          sortDate = true
        }
        console.log(sortDate)
      } else {
        sortDate = false
      }
      this.$store.dispatch('taskFilterDate', {
        id,
        sortDate
      })
        .then(() => {
          console.log(completed)
        //  this.$store.dispatch('loadTasks')
        })
    },
    // Edit
    taskEdit (id, title, description) {
      this.editingPopup = !this.editingPopup
      // console.log({id, title, description})
      this.taskId = id
      this.titleEditing = title
      this.desrEditing = description
    },
    // Cancel button (POPUP)
    cancelTaskEdit () {
      this.editingPopup = !this.editingPopup
      // Reset
      this.taskId = null
      this.titleEditing = ''
      this.desrEditing = ''
    },
    // Done button
    finishTaskEdit () {
      // console.log(this.titleEditing)
      this.$store.dispatch('editTask', {
        id: this.taskId,
        title: this.titleEditing,
        description: this.desrEditing
      })
      this.editingPopup = !this.editingPopup
    },
    // Delete button
    deleteTask (id) {
      this.$store.dispatch('deleteTask', id)
        .then(() => {
          console.log('task deleted')
          this.$store.dispatch('loadTasks')
        })
    },
    nowTime () {
      let date = new Date();
      return date.getTime()
    },
    dateString(date){
      let options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        };
        date = new Date(date)
      return date.toLocaleString(options)
    },
    dateArray(dates) {
    return dates =  this.dateString(dates).split('', 10)
    },
    inputDateString(inputDate){
      inputDate =  this.dateString(inputDate).split('', 10)
      for (let i = 2; i<= inputDate.length; i++ ){
        if(inputDate[i] = '-'){
          inputDate[i] = '.'
        }
        return inputDate
      }
    },
    timeString(time){
      let options = {
          minute: 'numeric',
          second: 'numeric'
        };
      time = new Date(time)
      return time.toLocaleString("ru", options)
    }
  },
  computed: {
    // Filter buttons
    tasksFilter () {
      if (this.filter === 'active') {
        return this.$store.getters.taskNotCompleted
      } else if (this.filter === 'completed') {
        return this.$store.getters.taskCompleted
      } else if (this.filter === 'all') {
        return this.$store.getters.tasks
      } else if (this.filter === 'find') {
        return this.$store.getters.taskGetDateFilter
      }
      return this.filter === 'active'
    }
  }
}
</script>

<style lang="stylus" scoped>
//
// Header buttons list
//
.ui-label
  background-color  black
.task-list__header
  display flex
  justify-content space-between
  align-items center
  margin-bottom 30px
.ui-title-1
  margin-bottom 0
//
// Task item
//
.ui-checkbox
  &.disabled
    display none
.task-item
  margin-bottom 20px
  .ui-checkbox:checked:before
    border-color black
  &:last-child
    margin-bottom 0
.ui-tag__wrapper
  margin-right 16px
// Info
.task-item__info
  display flex
  justify-content space-between
  align-items center
  margin-bottom 20px
  .button-close
    width 20px
    margin-right 0px 
    height @width
  .ui-label
    margin-right 8px
// Header
.task-item__header
  display flex
  align-items center
  margin-bottom 18px
  .ui-checkbox-wrapper
    margin-right 8px
  .ui-title-2
    margin-bottom 6px
// Body
.task-item__body
  margin-bottom 20px
// Footer
.tag-list
  margin-bottom 20px
.task-item__foter
  .buttons-list
    text-align right
// ALL buttons
.buttons-list
  .button
    margin-right 12px
    &:last-child
      margin-right 0
// POPUP
.ui-messageBox__wrapper
  &.active
    display flex
  .button-light
    margin-right 8px

.ui-card, .ui-tag
 border-color black
.ui-text
  color black
  font-size 20px
.button--round-done
  background-color black
.button-delete
  background-color red
  margin-top 10px
  margin-bottom 10px
.button-default
  border-color black

.time
  span 
    display flex
    margin-top 10px

.find-date--input
  width 25%
  margin-top 10px
  margin-bottom 10px
  margin-right 10px
  height 42px

.button-default
  margin-top 10px
  margin-bottom 10px
  background-color black 
  color white
</style>