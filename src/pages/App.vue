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
      :clipped="clipped"
      v-model="drawer"
      app
    >
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
      <v-container fluid v-if="state=='categories'">
            <div class="category" v-for="cat in categories" @click="showSubcategories(cat.title)">
              <p>{{cat.title}}</p>
            </div>
      </v-container>
      <v-container fluid v-if="state=='subcategories'">
        <div class="category" @click="state='categories'">
          <v-icon class="btn-icon">reply</v-icon>
        </div>
        <div class="category" v-for="cat in subcategories" @click="showProducts(cat.title)">
          <p>{{cat.title}}</p>
        </div>
      </v-container>
      <v-container fluid v-if="state=='products'">
        <div class="category" @click="state='subcategories'">
          <v-icon class="btn-icon">reply</v-icon>
        </div>
        <div class="product" v-for="cat in products" @click="">
          <div class="product_img"  v-bind:style="{ backgroundImage: 'url(' + cat.img + ')' }">

          </div>
          <div class="product_text">
            <p>{{cat.name}}</p>
          </div>
        </div>

      </v-container>
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
        clipped: false,
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
