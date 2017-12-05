<template>
  <v-app light>
    <v-navigation-drawer
      fixed
      :clipped="clipped"
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in admin"
          :to="item.link"
          :key="i"
          exact
        >
          <v-list-tile-action>
            <v-icon light v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" light></v-toolbar-side-icon>
      <v-toolbar-title>Coffee</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        light
        to="/admin"
        v-if="isAdmin"
      >
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn
        icon
        light
        @click="signOut"
        v-if="isAuth"
      >
        <v-icon>call_missed_outgoing</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout row justify-center>
          <transition name="slide-x-transition" mode="out-in">
            <router-view></router-view>
          </transition>
        </v-layout>
      </v-container>
    </v-content>

    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        clipped: false,
        drawer: true,
        fixed: false,
        admin: [
          {icon: 'supervisor_account', title: 'Пользователи', link:'users'},
          {icon: 'list', title: 'Категории', link:'categories'},
          {icon: 'shopping_cart', title: 'Товары', link:'products'},
          {icon: 'store', title: 'Склад', link:'storage'},
          {icon: 'timeline', title: 'Статистика', link:'statistics'}
        ]
      }
    },
    methods: {
      signOut () {
        this.$store.dispatch('signOut')
      }
    },
    computed: {
      isAdmin () {
        return this.$store.getters.isAdmin
      },
      isAuth () {
        return this.$store.getters.isAuth
      },
      user () {
        return this.$store.getters.user
      }
    }
  }
</script>
