<template lang="pug">
  .content-wrapper
    section
      .container
        h1.ui-title-1 Home
        form(@submit.prevent="onSubmit")
          // Task title
          .form-item(:class="{ errorInput: $v.taskTitle.$error }")
            input(
              type="text"
              placeholder="How did you spend your time?"
              v-model="taskTitle"
              @change="$v.taskTitle.$touch()"
              :class="{ error: $v.taskTitle.$error }"
            )
            .error(v-if="!$v.taskTitle.required") Title is required.
          // Task desr
          .form-item
            textarea(
              type="text"
              placeholder='Write a short description'
              v-model="taskDescription"
            )
          // TAG LIST
          // Add New Tag Button
          //.tag-list.tag-list--add
            .ui-tag__wrapper(
              @click="tagMenuShow = !tagMenuShow"
            )
              .ui-tag
                span.tag-title Add New
                span.button-close(
                  :class="{ active: !tagMenuShow }"
                )

          // Show Menu Input
          //transition(name="fade")
            .tag-list.tag-list--menu(
              v-if="tagMenuShow"
            )
              input.tag-add--input(
                type="text"
                placeholder="New tag"
                v-model="tagTitle"
                @keyup.enter="newTag"
              )
              .button.button-default(
                @click="newTag"
              ) Send

          // Show All Tags
          .tag-list
            transition-group(
              enter-active-class="animated fadeInRight"
              leave-active-class="animated fadeOutDown"
            )
              .ui-tag__wrapper(
                v-for="tag in tags"
                :key="tag.title"
              ) 
                //span.button-close(@click="deleteTag(tag.id)")
                .button.ui-tag(
                  @click="addTagUsed(tag)"
                  :class="{used: tag.use}"
                ) {{tag.title}}
            span {{this.tagUsed}}
          
          // SUBMIT
          .button-list
            button.button.button--round(
              type="submit"
              :disabled="submitStatus === 'PENDING'"
            ) Send

</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      submitStatus: null,
      taskTitle: '',
      taskDescription: '',
      // Total Time
      hours: 0,
      minutes: 10,
      // Tags
      //tagTitle: '',
      //tagMenuShow: false,
      tagUsed: '', 
      tags: [
        {title: 'Job', use: false},
        {title: 'Sleep', use: false},
        {title: 'Fun', use: false},
        {title: 'Other (With comment)', use: false},
        {title: 'Eat', use: false},
      ]
    }
  },
  // Vuelodate
  validations: {
    taskTitle: {
      required
    }
  },
  methods: {
    // Add New Tag
    // newTag () {
    //   if (this.tagTitle === '') {
    //     return
    //   }
    //   const tag = {
    //     title: this.tagTitle,
    //     use: false
    //   }
    //   this.$store.dispatch('newTag', tag)
    //   // Reset
    //   this.tagTitle = ''
    // },
    // Delete Tag
    // deleteTag (id) {
    //   this.$store.dispatch('deleteTag', id)
    //     .then(() => {
    //       console.log('tag deleted')
    //       this.$store.dispatch('loadTags')
    //     })
    // },
    // Add Used Tag
    addTagUsed (tag) {
      for (let i = 0; i < this.tags.length; i++) {
           if (this.tags[i].use = false) {
             this.tags[i].use = false
           }
        }
      tag.use = !tag.use
      this.tagUsed=tag.title
    },
    // Submit NEW TASK (submit button)
    onSubmit () {
      // Initialize Vuelodate
      this.$v.$touch()
      // Invalid
      if (this.$v.$invalid) {
        console.log('ERROR')
        this.submitStatus = 'ERROR'
      // Valid
      } else {
        // Time (What Watch)
        let time = this.nowTime().getTime()
        let beginDate = this.nowTime().getTime()
        let completeDate = ''
        let tagUsed = this.tagUsed
        // Task
        const task = {
          title: this.taskTitle,
          description: this.taskDescription,
          time,
          beginDate,
          completeDate,
          sortDate: false,
          tagUsed,
          completed: false,
          editing: false,
          show: false
        }
        this.$store.dispatch('newTask', task)
          .then(() => {
            this.submitStatus = 'OK'
          })
          .catch(err => {
            this.submitStatus = err.message
          })
        // Reset
        this.taskTitle = ''
        this.taskDescription = ''
        // Reset $v (validate)
        this.$v.$reset()
        // Reset for Tags
        this.tagUsed = ''
        // Reset tags.use + class used
        for (let i = 0; i < this.tags.length; i++) {
          this.tags[i].use = false
        }
      }
    },
    // COMMON Total Time
    getHoursAndMinutes (minutes) {
      let hours = Math.trunc(minutes / 60)
      let min = minutes % 60
      return hours + ' Hours ' + min + ' Minutes'
    },
    nowTime () {
      let date = new Date();
      return date
    },
  },
  computed: {
    // Total Time
    spentTime () {
      let min = (this.hours * 60) + (this.minutes * 1)
      return this.getHoursAndMinutes(min)
    }
  }
}
</script>

<style lang="stylus" scoped>
// Options
input,textarea,span
  border-color black
.option-list
  display flex
  align-items center
  margin-bottom 20px
  .what-watch--radio
    margin-right 12px
  input
    margin-bottom 0
  label
    margin-right 20px
    margin-bottom 0
    &:last-child
      margin-right 0
//
// Total time
//
.total-time
  margin-bottom 20px
.time-title
  display block
  margin-bottom 6px
.time-input
  max-width 80px
  margin-right 10px
//
// Tags
//
.tag-list
  margin-bottom 20px
.ui-tag__wrapper
  margin-right 18px
  margin-bottom 10px
  &:last-child
    margin-right 0
.ui-tag
  .tag-title 
    cursor pointer
    color black 
  &.used
    background-color: black
    color #ffffff
    .tag-title
        color #fff
    .button-close
      &:before,
      &:after
        background-color: #fff
  .button-close
    &.active
      transform: rotate(45deg)
// Tag Menu Show
.tag-list--menu
  display flex
  justify-content space-between
  align-items center
// New Tag Input
.tag-add--input
  margin-bottom 0
  margin-right 10px
  height 42px
//
// Total Time
//
.total-time
  p
    margin-bottom 6px
  span
    margin-right 16px
  .task-input
    max-width 80px
    margin-bottom 28px
    margin-right 10px
.button-list
  display flex
  justify-content flex-end  
  .button--round
    background-color  black
.button-default
  background-color black 
  color white
//
// Validate
//
.form-item
  .error
    display none
    margin-bottom 8px
    font-size 13.4px
    color #fc5c65
  &.errorInput
    .error
      display block
input
  &.error
    border-color #fc5c65
.ui-card, .ui-tag
  border-color black
</style>