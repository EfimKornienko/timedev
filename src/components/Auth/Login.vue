<template lang="pug">
    .content-wrapper
        section
            .container
                .auth
                    .auth__banner
                        h1.ui-title-1 Hello Banner
                    .auth__form
                        span.ui-title-2 Login
                        form(@submit.prevent="onSubmit")
                            .form-item(
                                :class="{ errorInput: $v.email.$error}"
                            )
                                input(
                                    type='email'
                                    placeholder='Email'
                                    v-model='email'
                                    :class="{ error: $v.email.$error}"
                                    @change='$v.email.$touch()'
                                )
                                .error(v-if='!$v.email.required') Empty
                                .error(v-if='!$v.email.email') Email is not correct
                            .form-item(
                                :class="{ errorInput: $v.password.$error}"
                            )
                                input(
                                    type='password'
                                    placeholder='Password'
                                    v-model='password'
                                    :class="{ error: $v.password.$error}"
                                    @change='$v.password.$touch()'
                                )
                                .error(v-if='!$v.password.required') Empty
                                .error(v-if='!$v.password.minLength') | Field B must have at least {{$v.password.$params.minLength.min}} letters.

                            .buttons-list 
                                button.button.button-primary(
                                    type='submit'
                                    :disabled="submitStatus === 'PENDING'"
                                )
                                    span(v-if = 'loading') Loading...
                                    span(v-else) Login
                            .buttons-list.buttons-list--info
                                p.typo__p(v-if="submitStatus === 'OK'") Thanks for your submission!
                                p.typo__p(v-if="submitStatus === 'ERROR'") Please fill the form correctly.
                                p.typo__p(v-else) {{ submitStatus }}
                            .buttons-list.buttons-list--info
                                span Need Registration?
                                    router-link(to='/registration')  Enter Here
</template>

<script>
import { required, email, minLength} from 'vuelidate/lib/validators'
export default {
    data() {
        return {
            email: '',
            password: '',
            submitStatus: null,
        }
    },
    validations: {
        email: {
            required,
            email
        },
        password: {
            required,
            minLength: minLength(6)
        }
    },
    methods: {
        onSubmit() {
            this.$v.$touch()
            if (this.$v.$invalid) {
                this.submitStatus = 'ERROR'
                } else {
                    const user ={
                        email: this.email,
                        password: this.password
                    }
                    this.$store.dispatch('loginUser', user)
                        .then(() =>{
                            console.log('LOGIN!')
                            this.submitStatus = 'OK'
                            this.$router.push('/')
                        })
                        .catch(err=>{
                            this.submitStatus = err.message
                        })


                    // do your submit logic here
                    // this.submitStatus = 'PENDING'
                    // setTimeout(() => {
                    // this.submitStatus = 'OK'
                    // }, 500)
                }
        }
    },
    computed: {
        loading () {
            return this.$store.getters.loading
        }
    }
}
</script>

<style lang="stylus" scoped>
.auth
    display  flex
    .auth__banner,
    .auth__form
        width 50%

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
        animation shake .3s
    
.buttons-list
    margin-bottom 20px
    text-align right 
    &.buttons-list--info
        text-align center
    &.last-child
        margin-bottom 0
a 
    color #444ce0

</style>