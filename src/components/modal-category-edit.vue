<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-btn icon slot="activator">
      <v-icon>edit</v-icon>
    </v-btn>

    <v-card>
      <v-card-title>
        <span v-if="category" class="headline">Edit category</span>
        <span v-else class="headline">Edit subcategory</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field v-if="category" label="Category name" v-model="comp_title"></v-text-field>
            <v-text-field v-else label="Subcategory name" v-model="comp_title"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
        <v-btn v-if="category" color="blue darken-1" flat @click="updateCategory">Save</v-btn>
        <v-btn v-else color="blue darken-1" flat @click="updateSubCategory">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import * as firebase from 'firebase'
  import 'firebase/firestore'

  export default {
    props: ['title', 'id', 'category'],
    data () {
      return {
        dialog: false,
        newTitle: null
      }
    },
    methods: {
      updateCategory () {
        firebase.firestore().collection('categories').doc(this.id).update({
          title: this.newTitle
        }).then(() => this.dialog = false)
      },
      updateSubCategory () {
        firebase.firestore().collection('subcategories').doc(this.id).update({
          title: this.newTitle
        }).then(() => this.dialog = false)
      }
    },
    computed: {
      comp_title: {
        get () {
          return this.title
        },
        set (val) {
          this.newTitle = val
        }
      }
    }
  }
</script>
