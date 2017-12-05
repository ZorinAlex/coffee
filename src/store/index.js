import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import 'firebase/firestore'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {}
  },
  getters: {
    user (state) {
      return state.user
    },
    isAuth (state) {
      return !!Object.keys(state.user).length
    },
    isAdmin (state) {
      if (state.user.hasOwnProperty('admin')) return !!state.user.admin;
      else return false
    }
  },
  mutations: {
    setUser (state, data) {
      state.user = data
    }
  },
  actions: {
    login ({commit, dispatch}, credentials) {
        firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
        .then( user => dispatch('loadUser', user.uid))
    },
    loadUser ({commit}, id) {
      return new Promise(resolve => {
        firebase.firestore().collection('users').doc(id).get()
          .then(d => {
            console.log('user data loaded');

            let data = d.data();
            commit('setUser', {
              ...data
            });
            resolve()
          })
      })
    },
    signOut ({commit}) {
      firebase.auth().signOut().then(() => commit('setUser', {}))
    }
  }
})
