<template>
  <v-app light>
    <v-navigation-drawer
      fixed
      :mobile-break-point="360"
      :width="500"
      :clipped="clipped"
      v-model="drawer"
      app
    >
      <v-subheader>Checklist</v-subheader>
      <v-list>
        <v-list-tile v-for="(item, key) in check" :key="key">
          <v-list-tile-content>
            {{ item.title }}

          </v-list-tile-content>

          <v-card-actions>
            <v-btn fab small @click.stop="removeCountCheck(key)">
              <v-icon>remove</v-icon>
            </v-btn>

            <v-spacer></v-spacer>

            <div>{{ item.count }}</div>

            <v-spacer></v-spacer>

            <v-btn fab small @click.stop="addCountCheck(key)">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-actions>

          <v-list-tile-action>
            {{ item.price * item.count }}

          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            Total sum
          </v-list-tile-content>

          <v-list-tile-action>
            {{ checkTotalSum }}
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed app clipped-left>
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
          <v-flex xs6>
            <v-subheader>CATEGORIES</v-subheader>
            <v-layout row wrap>
              <v-flex xs12 v-for="(cat, index) in categories" :key="index" @click="showSubcategories(cat.title)">
                <v-card style="padding: 10px" class="blue white--text">
                  <h1 class="text-xs-center">{{cat.title}}</h1>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs6>
            <v-subheader>SUBCATEGORIES</v-subheader>
            <v-layout row wrap>
              <v-flex xs12 v-for="(cat, index) in subcategories" :key="index" @click="showProducts(cat.title)">
                <v-card style="padding: 10px" class="green white--text">
                  <h1 class="text-xs-center">{{cat.title}}</h1>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs12>
            <v-subheader>PRODUCTS</v-subheader>
            <v-layout row wrap>
              <v-flex xs2 v-for="(prod, index) in products" :key="prod.name" @click="addToCheck(index, prod)">
                <v-card>
                  <v-card-media height="100px" :src="prod.img"></v-card-media>
                  <v-card-actions>
                    <div>{{prod.name}}</div>
                    <v-spacer></v-spacer>
                    <div>{{prod.price}}</div>
                  </v-card-actions>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-btn fab small @click.stop="removeCount(index)">
                      <v-icon>remove</v-icon>
                    </v-btn>

                    <v-spacer></v-spacer>

                    <div>{{ prod.count }}</div>

                    <v-spacer></v-spacer>

                    <v-btn fab small @click.stop="addCount(index)">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
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
  import * as firebase from 'firebase'
  import 'firebase/firestore'
  import VListTileAction from "vuetify/src/components/VList/VListTileAction";

  export default {
    components: {VListTileAction}, data () {
      return {
        clipped: true,
        drawer: true,
        fixed: false,
        categories: [],
        subcategories: [],
        products: [],
        state: 'categories',
        check: {}
      }
    },
    methods: {
      addCount (index) {
        this.products[index].count++
      },
      addCountCheck (key) {
        let prod = this.check[key];
        prod.count++;
        this.check = Object.assign({}, this.check, {[key]: {title: prod.title, price: prod.price, count: prod.count}});
      },
      removeCountCheck (key) {
        let prod = this.check[key];
        if (prod.count > 1) {
          prod.count--;
          this.check = Object.assign({}, this.check, {
            [key]: {
              title: prod.title,
              price: prod.price,
              count: prod.count
            }
          });
        } else if (prod.count === 1) {
          let check = this.check;
          delete check[key];
          this.check = Object.assign({}, check);
        }
      },
      removeCount (index) {
        if (this.products[index].count > 1) this.products[index].count--
      },
      addToCheck (index, prod) {
        if (this.check.hasOwnProperty(prod.id)) {
          let count = this.check[prod.id].count;
          this.check = Object.assign({}, this.check, {
            [prod.id]: {
              title: prod.name,
              price: prod.price,
              count: prod.count + count
            }
          });
          this.products[index].count = 1;
        }
        else {
          this.check = Object.assign({}, this.check, {
            [prod.id]: {
              title: prod.name,
              price: prod.price,
              count: prod.count
            }
          });
          this.products[index].count = 1;
        }
      },
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
          this.state = 'products'
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
                  id: product.id,
                  count: 1
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
      },
      checkTotalSum () {
        let total = 0;
        for(let i in this.check) {
          total += this.check[i].price * this.check[i].count
        }
        return total
      }
    },
    created () {
      this.loadCategories();
    }
  }

</script>
