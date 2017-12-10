import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import * as firebase from 'firebase'

import App from '@/pages/App2'
import Login from '@/pages/Login'
import Admin from '@/pages/Admin'

// admin pages
import Users from '@/pages/admin/Users'
import Categories from '@/pages/admin/Categories'
import Products from '@/pages/admin/Products'
import Storage from '@/pages/admin/Storage'
import Statistics from '@/pages/admin/Statistics'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/app'
    },
    {
      path: '/app',
      name: 'App',
      component: App,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/admin',
      component: Admin,
      meta: {
        requireAdmin: true,
        requireAuth: true
      },
      children: [
        {
          path: '',
          redirect: 'users'
        },
        {
          path: 'users',
          component: Users
        },
        {
          path: 'categories',
          component: Categories
        },
        {
          path: 'products',
          component: Products
        },
        {
          path: 'storage',
          component: Storage
        },
        {
          path: 'statistics',
          component: Statistics
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  firebase.auth().onAuthStateChanged(user => {
    return new Promise(resolve => {
      if (user) {
        store.dispatch('loadUser', user.uid)
          .then(() => resolve())
      }
      else resolve()
    })
      .then(() => {
        let reqAuth = to.meta.requireAuth;
        let reqAdmin = to.meta.requireAdmin;
        let isAuth = store.getters.isAuth;
        let isAdmin = store.getters.isAdmin;

        if (reqAuth && !isAuth || reqAdmin && !isAdmin) {
          next('/login')
        }
        else {
          next()
        }
      })
  })
});


export default router
