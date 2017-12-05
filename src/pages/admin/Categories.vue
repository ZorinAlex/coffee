<template>
  <v-flex style="max-width: 800px">
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs6 d-flex>
          <v-card>
            <v-subheader>Categories</v-subheader>
            <v-list>
              <v-list-tile v-for="item in categories" :key="item.title">
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <category-edit :title="item.title" :id="item.id" :category="true"></category-edit>
                </v-list-tile-action>

                <v-list-tile-action>
                  <v-btn icon @click="deleteCategory(item.title, item.id)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-tile-action>


                <v-list-tile-action>
                  <v-btn icon @click="loadSubCategories(item.title); selectedCategory = item.title">
                    <v-icon>keyboard_arrow_right</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-list twoLine>
              <v-list-tile>
                <v-list-tile-content>
                  <v-text-field
                    label="Add category title"
                    v-model="newCategory"
                  ></v-text-field>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn dark icon color="blue" @click="addCategory">
                    <v-icon>add</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>

        <v-flex xs6 d-flex>
          <v-card>
            <v-subheader>Subcategories</v-subheader>
            <template v-if="selectedCategory">
              <v-list>
                <v-list-tile v-for="item in subcategories" :key="item.title">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <category-edit :title="item.title" :id="item.id" :category="false"></category-edit>
                  </v-list-tile-action>

                  <v-list-tile-action>
                    <v-btn icon>
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>

              <v-list twoLine>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-text-field
                      label="Название подкатегории"
                      v-model="newSubCategory"
                    ></v-text-field>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn dark icon color="blue" @click="addSubCategory">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </template>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>

<script>
  import * as firebase from 'firebase'
  import 'firebase/firestore'

  import categoryEdit from '@/components/modal-category-edit'

  export default {
    components: {
      categoryEdit
    },
    data: () => ({
      newCategory: null,
      newSubCategory: null,
      selectedCategory: null,

      categories: [],
      subcategories: null
    }),
    created () {
      this.loadCategories()
    },
    methods: {
      loadCategories() {
        firebase.firestore().collection('categories')
          .onSnapshot(categories => {
            let arr = [];

            categories.forEach(category => {
              arr.push({
                ...category.data(),
                id: category.id
              });

              this.categories = arr
            })
          })
      },

      loadSubCategories(category) {
        this.subcategories = [];
        firebase.firestore().collection('subcategories').where('category', '==', category)
          .onSnapshot(subcategories => {
            let arr = [];

            subcategories.forEach(subcategory => {
              arr.push({
                ...subcategory.data(),
                id: subcategory.id
              });

              this.subcategories = arr
            })
          })
      },

      addCategory () {
        firebase.firestore().collection('categories').add({
          title: this.newCategory
        }).then(() => this.newCategory = null)
      },

      addSubCategory () {
        firebase.firestore().collection('subcategories').add({
          title: this.newSubCategory,
          category: this.selectedCategory
        }).then(() => this.newSubCategory = null)
      },

      deleteCategory (category, id) {
        firebase.firestore().collection('categories').doc(id).delete()
          .then(() => {
            firebase.firestore().collection('subcategories').where('category', '==', category).get()
              .then(subcategories => {
                subcategories.forEach(doc => {
                  firebase.firestore().collection('subcategories').doc(doc.id).delete()
                    .then(() => {
                      this.subcategories = null;
                      this.selectedCategory = null
                    })
                })
              })
          })
      }
    }
  }
</script>
