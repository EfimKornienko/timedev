// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import VueCharts from 'vue-chartjs'
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
  UiMinu,
  VueCharts
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
      apiKey: 'AIzaSyBoF3ydX4grnUnOvBQKjQpLTrnMC8T2QYA',
      authDomain: 'filmlibrary-vue.firebaseapp.com',
      databaseURL: 'https://filmlibrary-vue.firebaseio.com',
      projectId: 'filmlibrary-vue',
      storageBucket: '',
      messagingSenderId: '37744227930'
    }
    firebase.initializeApp(config)

    // Auth Check
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Check Logged
        this.$store.dispatch('loggedUser', user)
        // Loading All Tasks
        this.$store.dispatch('loadTasks')
        this.$store.dispatch('loadStat')
      }
    })
  }
})
