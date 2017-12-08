<style>
  .category{
    width:200px;
    height:200px;
    background: #5aabf8;
    color: #000;
    border-radius: 5px;
    margin: 10px;
    display: inline-flex;
    line-height: 30px;
    box-shadow: 5px 5px 10px #838383;
  }
  .product_img{
    background-size: cover;
    width:200px;
    height:200px;
    float:left;
  }
  .product_text{
    float:right;
  }
  .product{
    width: 300px;
    display: inline-flex;
  }
  .category:hover{
    box-shadow: 5px 5px 10px #646464;
  }
  .category > p{
    margin: auto;
    font-size: 45px;
  }
  .btn-icon{
    color: #000!important;
    margin: auto;
    font-size: 50px
  }
</style>

<template>
  <v-app light>
    <v-navigation-drawer
      fixed
      disable-resize-watcher
      :mobile-break-point="360"
      :width="200"
      :clipped="clipped"
      v-model="drawer"
      app
    >
      <v-list subheader>
        <v-subheader>Categories</v-subheader>
        <template v-for="(cat, index) in categories">
          <v-list-tile :key="index" @click="showSubcategories(cat.title)">
            <v-list-tile-content>
              {{ cat.title }}
          </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index+1 < categories.length"></v-divider>
        </template>
      </v-list>

      <v-list subheader>
        <v-subheader>Subcategories</v-subheader>
        <template v-for="(subcat, index) in subcategories">
          <v-list-tile :key="index" @click="showProducts(subcat.title)">
            <v-list-tile-content>
              {{ subcat.title }}
          </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index+1 < subcat.length"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      fixed
      disable-resize-watcher
      right
      :mobile-break-point="360"
      :width="300"
      :clipped="clipped"
      v-model="drawer"
      app
    >
      <v-list subheader>
        <v-subheader>Check</v-subheader>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app clipped-left clipped-right>
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
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs2 sm3 v-for="prod in products" :key="prod.name">
            <v-card hover>
              <v-card-media height="100px" :src="prod.img"></v-card-media>
              <v-card-title primary-title>{{prod.name}}</v-card-title>
              <v-divider></v-divider>
              <v-card-text>{{prod.price}}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <!--
      <v-container fluid>
        <v-layout justify-center>
          <v-flex style="max-width: 600px">
            <v-card v-if="state === 'categories'">
              <v-toolbar class="green" dark>
                <v-toolbar-title>Categories</v-toolbar-title>
              </v-toolbar>

              <v-divider></v-divider>

              <v-card-actions>
                <v-container fluid grid-list-lg>
                  <v-layout row wrap>
                    <v-flex xs12 v-for="cat in categories" :key="cat.title" @click="showSubcategories(cat.title)">
                      <v-btn style="height: 80px" block color="blue" dark large>{{cat.title}}</v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-actions>
            </v-card>

            <v-card v-if="state === 'subcategories'">
              <v-toolbar class="green" dark>
                <v-btn icon @click="state = 'categories'">
                  <v-icon>subdirectory_arrow_left</v-icon>
                </v-btn>
                <v-toolbar-title>Subcategories</v-toolbar-title>
              </v-toolbar>

              <v-divider></v-divider>

              <v-card-actions>
                <v-container fluid grid-list-lg>
                  <v-layout row wrap>
                    <v-flex xs12 v-for="subcat in subcategories" :key="subcat.title" @click="showProducts(subcat.title)">
                      <v-btn style="height: 80px" block color="blue" dark large>{{subcat.title}}</v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <!--
      <v-container fluid grid-list-lg>
        <v-layout row wrap v-if="state === 'categories'">
          <v-flex xs12 v-for="cat in categories" :key="cat.title" @click="showSubcategories(cat.title)">
            <v-card style="height: 100px;" class="primary" hover>
              <v-container fluid fill-height>
                <v-card-text class="headline white--text text-xs-center">{{cat.title}}</v-card-text>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>

        <v-layout row wrap v-if="state === 'subcategories'">
          <v-flex xs12 @click="state = 'categories'">
            <v-card style="height: 100px;" class="primary" hover>
              <v-container fluid fill-height>
                <v-card-text class="headline text-xs-center">
                  <v-avatar>
                    <v-icon dark>subdirectory_arrow_left</v-icon>
                  </v-avatar>
                </v-card-text>
              </v-container>
            </v-card>
          </v-flex>

          <v-flex xs12 v-for="subcat in subcategories" :key="subcat.title" @click="showProducts(subcat.title)">
            <v-card style="height: 100px;" class="primary" hover>
              <v-container fluid fill-height>
                <v-card-text class="headline white--text text-xs-center">{{subcat.title}}</v-card-text>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>

        <v-layout row wrap v-if="state === 'products'">
          <v-flex xs12 @click="state = 'subcategories'">
            <v-card style="height: 100px;" class="primary" hover>
              <v-container fluid fill-height>
                <v-card-text class="headline text-xs-center">
                  <v-avatar>
                    <v-icon dark>subdirectory_arrow_left</v-icon>
                  </v-avatar>
                </v-card-text>
              </v-container>
            </v-card>
          </v-flex>

          <v-flex xs12 v-for="prod in products" :key="prod.title">
            <v-card color="grey lighten-2" class="white--text">
              <v-toolbar flat>
                <v-toolbar-title>{{prod.name}}</v-toolbar-title>
              </v-toolbar>

              <v-divider></v-divider>

              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs4>
                    <v-card-media
                      :src="prod.img"
                      height="125px"
                      contain
                    ></v-card-media>
                  </v-flex>
                  <v-flex xs8>
                    <v-list dense>
                      <v-list-tile v-for="item in prod.consist" :key="prod.name">
                        <v-list-tile-content>
                          {{item.name}}
                        </v-list-tile-content>

                        <v-list-tile-action>
                          {{item.value}}
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      -->
    </v-content>

    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  import * as firebase from 'firebase'
  import 'firebase/firestore'

  export default {
    data () {
      return {
        clipped: true,
        drawer: true,
        fixed: false,
        categories: [],
        subcategories: [],
        products: [],
        state: 'categories'
      }
    },
    methods: {
      signOut () {
        this.$store.dispatch('signOut')
      },
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
      showSubcategories(category){
        this.loadSubCategories(category).then(() => {
          if (this.subcategories.length > 0) {
            this.state = 'subcategories';
          }
        })
      },
      showProducts(subcategory){
        this.loadProducts(subcategory).then(() => {
            this.state='products'
        })
      },
      loadSubCategories(category) {
        return new Promise(res => {
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
                res();
              })
            })
        });

      },
      loadProducts(subcategory) {
        return new Promise(res => {
          this.products = [];
          firebase.firestore().collection('products').where('subcategory', '==', subcategory)
            .onSnapshot(products => {
              let arr = [];

              products.forEach(product => {
                arr.push({
                  ...product.data(),
                  id: product.id
                });

                this.products = arr
                res();
              })
            })
        });
      },
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
      },
      created () {
        this.loadCategories();
      }
    }

</script>
