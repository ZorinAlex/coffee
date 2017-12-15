<style>
  #prev{
    width: 150px;
    height: 150px;
  }
  .prev_btn{
    position: absolute;
    top: 45%;
    left: 45%;
    transform: translate(-50%, -50%);
  }
</style>

<template>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-dialog
      v-model="dialog"
      fullscreen
      transition="dialog-bottom-transition"
      :overlay=false
      scrollable
    >
      <v-btn slot="activator" color="primary" dark @click.stop="dialog = true">Добавить товар</v-btn>

      <v-card>
        <form>
          <v-toolbar style="flex: 0 0 auto;" dark class="primary">
            <v-btn icon @click.native="dialog = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Новый товар</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="saveProduct" :loading="process">Сохранить</v-btn>

            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>

            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="name"
                    label="Название"
                    :error-messages="nameErrors"
                    @input="$v.name.$touch()"
                    @blur="$v.name.$touch()"
                    :disabled="process"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-model="description"
                    label="Описание"
                    multiLine
                    rows="1"
                    :disabled="process"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    v-model="price"
                    label="Цена"
                    :error-messages="priceErrors"
                    @input="$v.price.$touch()"
                    @blur="$v.price.$touch()"
                    :disabled="process"
                  ></v-text-field>
                </v-flex>

                <v-flex xs6>
                  <v-select
                    v-bind:items="categories"
                    item-value="title"
                    item-text="title"
                    v-model="category"
                    label="Категория"
                    :error-messages="categoryErrors"
                    @change="$v.category.$touch()"
                    :disabled="process"
                  ></v-select>
                </v-flex>

                <v-flex xs6>
                  <v-select
                    v-if="!subcategories.length<1"
                    v-bind:items="subcategories"
                    item-value="title"
                    item-text="title"
                    v-model="subcategory"
                    label="Подкатегория"
                    :error="isInvalidSubcategory"
                    @change="changeSubcategory"
                    :disabled="process"
                  ></v-select>
                </v-flex>
              </v-layout>
              <h2>
                Состав:
              </h2>
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
                  <v-btn dark icon color="red" @click="delConsist(index)" :disabled="process">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs3>
                  <v-text-field
                    label="Название"
                    v-model="consistsItemName"
                    :disabled="process"
                  ></v-text-field>
                </v-flex>

                <v-flex xs2>
                  <v-text-field
                    label="Количество"
                    v-model="consistsItemValue"
                    :disabled="process"
                  ></v-text-field>
                </v-flex>

                <v-flex xs1>
                  <v-btn dark icon color="blue" @click="addConsist" :disabled="process">
                    <v-icon>add</v-icon>
                  </v-btn>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs6>
                  <v-layout justify-center>
                    <div style="position: relative;">
                      <canvas width="150" height="150" id="canvas"/>
                      <v-btn class="prev_btn" fab large @click="selectFile" :disabled="process"><v-icon>add_a_photo</v-icon></v-btn>
                    </div>
                    <input @change="onFileChange" type='file' ref="file" style="display: none">
                    <v-alert outline color="error" icon="warning" :value="isInvalidFile">
                      Прикрепите изображение.
                     </v-alert>
                  </v-layout>

                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <!--<div style="flex: 1 1 auto;"></div>-->
        </form>
      </v-card>
    </v-dialog>
    <v-spacer></v-spacer>
  </v-card-actions>
</template>

<script>
  import * as firebase from 'firebase'
  import 'firebase/firestore'
  import uploader from './product-image-upload'
  import $ from "jquery";
  import { validationMixin } from 'vuelidate'
  import { required, numeric } from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],
    validations: {
      name: { required },
      price: { numeric, required},
      category : { required }
    },
    components: {
      uploader
    },
    data () {
      return {
        prevURL: null,
        dialog: false,
        img: null,
        name: null,
        price: null,
        description: null,
        consistsItemName: null,
        consistsItemValue: null,
        consists: [],
        category: null,
        subcategory: null,
        isInvalidFile: false,
        isInvalidSubcategory: false,
        categories: [],
        subcategories: [],
        storage: [],
        process: false
      }
    },
    created () {
      this.loadCategories();
      this.loadFromStorage();
    },
    watch: {
      category: function (val) {
        this.loadSubCategories(val);
      }
    },
    methods: {
      saveProduct(){
          if(!this.img){
              this.isInvalidFile = true;
          }else{
              this.isInvalidFile = false;
          }
          if(!this.subcategories.length<1){
              if(this.subcategory!=null){
                this.isInvalidSubcategory = false;
              }else{
                this.isInvalidSubcategory = true;
              }
          }else{
             this.isInvalidSubcategory = false;
          }
        this.$v.$touch();
        if(!this.isInvalidFile && !this.$v.$invalid && !this.isInvalidSubcategory){
            let productID;
            this.process=true;
            let newConsists = [];
            this.storage.forEach((item)=>{
                this.consists.forEach((con)=>{
                    if(item.name!=con.name){
                        if(newConsists['name']!=con.name){
                          newConsists.push({name:con.name,value: con.value})
                        }
                    }
                })
            });
            this.addToStorage(newConsists);
            firebase.firestore().collection('products').add({
              img: document.getElementById('canvas').toDataURL(),
              name: this.name,
              price: this.price,
              description: this.description,
              category: this.category,
              subcategory: this.subcategory,
              consist: this.consists
            })
              .then(() => {
                this.dialog = false;
                this.img = null;
                this.name = null;
                this.price = null;
                this.description = null;
                this.consistsItemName = null;
                this.consistsItemValue = null;
                this.consists = [];
                this.category = null;
                this.subcategory = null;
                this.subcategories = null;
                this.isInvalidFile = false;
                this.isInvalidSubcategory = false;
                this.$v.$reset();
                document.getElementById('canvas').getContext('2d').clearRect(0, 0, 150, 150);
                this.process = false;
              })
        }

      },
      addConsist(){
          if(this.consistsItemName !=null && this.consistsItemValue!=null){
            this.consists.push(
              {
                'name': this.consistsItemName,
                'value': this.consistsItemValue
              }
            );
            this.consistsItemName = null;
            this.consistsItemValue = null;
          }

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
              if(arr.length>1){
                  this.isInvalidSubcategory = true
              }else{
                this.isInvalidSubcategory = false
              }
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
          this.img = files[0];
          this.isInvalidFile = false;
        } else {
          this.img = null
        }
      },
      changeSubcategory(){
          this.isInvalidSubcategory = false;
      },
      addToStorage(items){
          items.forEach((item)=>{
            firebase.firestore().collection('storage').add({
              ...item
            })
          })
      },
      loadFromStorage(){
        firebase.firestore().collection('storage')
          .onSnapshot(items => {
            let arr = [];
            items.forEach(item => {
              arr.push({
                ...item.data(),
                id: item.id
              });
              this.storage = arr
            })
          })
      }
    },
    computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.required && errors.push('Введите название товара')
        return errors
      },
      priceErrors () {
        const errors = []
        if (!this.$v.price.$dirty) return errors
        !this.$v.price.numeric && errors.push('Цена должна быть числом')
        !this.$v.price.required && errors.push('Введите цену товара')
        return errors
      },
      categoryErrors () {
        const errors = []
        if (!this.$v.category.$dirty) return errors
        !this.$v.category.required && errors.push('Выберите категорию')
        return errors
      }
    }
  }
</script>
