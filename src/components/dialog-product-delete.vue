<template>
  <v-dialog
    v-model="dialog"
    maxWidth="500px"
    persistent
  >
    <v-btn slot="activator" icon @click.stop="dialog = true">
      <v-icon>delete</v-icon>
    </v-btn>

    <v-card>
      <v-card-text>
        <div class="headline">Are you sure that you want to delete this product?</div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn dark color="blue" :loading="processing" @click="deleteProduct">Accept</v-btn>
        <v-btn dark color="red" :loading="processing" @click.stop="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  import * as firebase from 'firebase'
  import 'firebase/firestore'


  export default {
    props: ['productID'],
    data () {
      return {
        dialog: false,
        processing: false
      }
    },
    created () {

    },
    watch: {

    },
    methods: {
      deleteProduct () {
        this.processing = true;
        firebase.firestore().collection('products').doc(this.productID)
          .delete()
          .then(()=>{
            this.dialog = false;
            this.processing = false;
        })
      }
    },
    computed: {

    }
  }
</script>
