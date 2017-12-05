<template>
  <v-flex style="max-width: 1200px">
    <v-card>
      <v-data-table
        :headers="headers"
        :items="users"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-right">{{ props.item.fname }}</td>
          <td class="text-xs-right">{{ props.item.lname }}</td>
          <td class="text-xs-right">{{ props.item.admin || false }}</td>
        </template>
      </v-data-table>
    </v-card>
  </v-flex>
</template>

<script>
  import * as firebase from 'firebase'
  import 'firebase/firestore'

  export default {
      data: () => ({
        users: [],

        headers: [
          { text: 'First name', value: 'fname' },
          { text: 'Last name', value: 'lname' },
          { text: 'Is admin', value: 'admin' }
        ]
      }),
      created () {
        this.loadUsers()
      },
      methods: {
        loadUsers() {
          firebase.firestore().collection('users')
            .onSnapshot(users => {
              let arr = [];

              users.forEach(user => {
                arr.push({
                  ...user.data()
                });

                this.users = arr
              })
            })
        }
      }
  }
</script>
