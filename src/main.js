// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import * as firebase from 'firebase'

import root from './pages/Root'
import router from './router'
import store from './store'

Vue.use(Vuetify)
Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyAeLG06dAHmtqYuSGgQfKPsSSVX1whk6M8",
  authDomain: "coffee-377cd.firebaseapp.com",
  databaseURL: "https://coffee-377cd.firebaseio.com",
  projectId: "coffee-377cd",
  storageBucket: "coffee-377cd.appspot.com",
  messagingSenderId: "809431050116"
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<root/>',
  components: { root }
})
