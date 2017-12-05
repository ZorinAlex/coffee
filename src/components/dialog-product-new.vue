<style>
  #prev{
    width: 150px;
    height: 150px;
  }
</style>
<template>
  <div>

    <v-layout row justify-center>
      <v-btn color="primary" dark @click.stop="dialog = true">Добавить товар</v-btn>

      <v-dialog
        v-model="dialog"
        fullscreen
        transition="dialog-bottom-transition"
        :overlay=false
        scrollable
      >
        <v-card>
          <v-toolbar style="flex: 0 0 auto;" dark class="primary">
            <v-btn icon @click.native="dialog = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Новый товар</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="saveProduct">Сохранить</v-btn>

            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="name"
                    label="Название"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-model="description"
                    label="Описание"
                    multiLine
                    rows="1"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-model="price"
                    label="Цена"
                  ></v-text-field>
                </v-flex>

                <v-flex xs6>
                  <v-select
                    v-bind:items="categories"
                    item-value="title"
                    item-text="title"
                    v-model="category"
                    label="Категория"
                  ></v-select>
                </v-flex>

                <v-flex xs6>
                  <v-select
                    v-if="subcategories"
                    v-bind:items="subcategories"
                    item-value="title"
                    item-text="title"
                    v-model="subcategory"
                    label="Подкатегория"
                  ></v-select>
                </v-flex>
              </v-layout>

              <v-layout row wrap v-for="(item, index) in consists" :key="item.name">
                <v-flex xs3>
                  <v-text-field
                    label="Название"
                    :value="item.name"
                    readonly
                  ></v-text-field>
                </v-flex>

                <v-flex xs2>
                  <v-text-field
                    label="Количество"
                    :value="item.value"
                    readonly
                  ></v-text-field>
                </v-flex>

                <v-flex>
                  <v-btn dark icon color="red" @click="delConsist(index)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs3>
                  <v-text-field
                    label="Название"
                    v-model="consistsItemName"
                  ></v-text-field>
                </v-flex>

                <v-flex xs2>
                  <v-text-field
                    label="Количество"
                    v-model="consistsItemValue"
                  ></v-text-field>
                </v-flex>

                <v-flex>
                  <v-btn dark icon color="blue" @click="addConsist">
                    <v-icon>add</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-flex>
              <canvas width="150" height="150" id="canvas"/>
            </v-flex>
            <v-flex>
              <v-text-field v-if="img" label="Имя файла" :value="img.name"></v-text-field>
            </v-flex>
            <input @change="onFileChange" type='file' ref="file" style="display: none">
            <v-btn @click="selectFile">Add image</v-btn>
          </v-card-actions>

          <!--<div style="flex: 1 1 auto;"></div>-->

        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
  import * as firebase from 'firebase'
  import 'firebase/firestore'
  import uploader from './product-image-upload'
  import $ from "jquery";

  export default {
    components: {
      uploader
    },
    data () {
      return {
        prevURL: null,
        dialog: false,
        img: null,
        name: null,
        price: 0,
        description: null,
        consistsItemName: null,
        consistsItemValue: null,
        consists: [],
        category: null,
        subcategory: null,

        categories: [],
        subcategories: null
      }
    },
    created () {
      this.loadCategories()
    },
    watch: {
      category: function (val) {
        this.loadSubCategories(val);
      }
    },
    methods: {
      saveProduct(){
        let productID;
        firebase.firestore().collection('products').add({
          img: document.getElementById('canvas').toDataURL(),
          name: this.name,
          price: this.price,
          description: this.description,
          category: this.category,
          subcategory: this.subcategory,
          consist: this.consists
        })
//          .then(product => {
//            productID = product.id;
//            return firebase.storage().ref('products').child(productID).put(this.img)
//          })
//          .then((file) => {
//            return firebase.firestore().collection('products').doc(productID).update({
//              img: file.downloadURL
//            })
//          })
          .then(() => {
            this.dialog = false
            this.img = null
            this.name = null
            this.price = 0
            this.description = null
            this.consistsItemName = null
            this.consistsItemValue = null
            this.consists = []
            this.category = null
            this.subcategory = null
            this.subcategories = null
          })
      },
      addConsist(){
        this.consists.push(
          {
            'name': this.consistsItemName,
            'value': this.consistsItemValue
          }
        );
        this.consistsItemName = null;
        this.consistsItemValue = null;
      },
      delConsist(index){
        this.consists.splice(index, 1)
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
      selectFile () {
        this.$refs.file.click()
      },
      onFileChange ($event) {
        const files = $event.target.files || $event.dataTransfer.files;
        let originalImgWidth, originalImgHeight, ImgWidth, ImgHeight, offsetW,offsetH = 0;

        if (files.length > 0) {
          let reader = new FileReader();
          let ctx = document.getElementById('canvas').getContext('2d');

          reader.onload = function(e){
            let img = new Image;
            console.log(img)
            img.src = e.target.result;
            img.onload = function() {
              originalImgWidth = this.width;
              originalImgHeight = this.height;
              if(originalImgWidth > originalImgHeight){
                ImgHeight = 150;
                ImgWidth = 150/originalImgHeight * originalImgWidth;
                offsetH = 0;
                offsetW = -(ImgWidth - 150)/2
              }else{
                ImgWidth = 150;
                ImgHeight = 150/originalImgWidth * originalImgHeight;
                offsetH = -(ImgHeight - 150)/2
                offsetW = 0;
              }
              ctx.drawImage(img, offsetW,offsetH,ImgWidth,ImgHeight);
            };
          };
          reader.readAsDataURL(files[0]);
          this.img = files[0]
        } else {
          this.img = null
        }
      }
    }

  }
</script>
