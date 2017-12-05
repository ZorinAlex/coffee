<template>
  <v-app light>
    <v-content>
      <v-container fluid fill-height>
        <v-layout row justify-center align-center>
          <v-flex xs12>
            <v-form>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Email"
                    v-model="email"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    label="Password"
                    v-model="password"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-btn @click="login">Login</v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
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
    data: () => ({
      email: 'alexzorin@gmail.com',
      password: 'zalupka'
    }),
    methods: {
      login () {
        this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        }).then(() => this.$router.push('/'))
      }
    }
  }
</script>
