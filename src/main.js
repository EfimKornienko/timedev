// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import UiMinu from 'uimini/dist/css/uimini.css'

import App from './App'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'

Vue.use(
  Vuelidate,
  UiMinu
)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    let config = {
      apiKey: 'AIzaSyAFNBZqlo1Azk0YDdAMiz0gObNanIQRfoI',
      authDomain: 'filmlibrary-vue.firebaseapp.com',
      databaseURL: 'https://timedev-6e6c0.firebaseio.com',
      projectId: 'filmlibrary-vue',
      storageBucket: '',
      messagingSenderId: '37744227930'
    }
    firebase.initializeApp(config)

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Check Logged
        this.$store.dispatch('loggedUser', user)
        // Loading All Tasks
        this.$store.dispatch('loadTasks')
      }
    })
  }
})
