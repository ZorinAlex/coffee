<template>
  <v-flex style="max-width: 100%">

      <v-layout row wrap>
          <v-card>
            <v-subheader>Товары</v-subheader>
            <v-data-table
              :headers="headers"
              :items="products"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-center">
                  <v-avatar size="80px" tile>
                    <img :src="props.item.img" alt="props.item.name">
                  </v-avatar>
                </td>
                <td class="text-xs-center">{{ props.item.name }}</td>
                <td class="text-xs-center">{{ props.item.description }}</td>
                <td class="text-xs-center">{{ props.item.price }}</td>
                <td class="text-xs-center">{{ props.item.category }}</td>
                <td class="text-xs-center">{{ props.item.subcategory }}</td>
                <td>
                  <product-edit :product="props.item"></product-edit>
                  <product-delete :productID = 'props.item.id'></product-delete>
                </td>
              </template>
            </v-data-table>
            <product-new></product-new>
          </v-card>
      </v-layout>

  </v-flex>
</template>
<script>
  import * as firebase from 'firebase'
  import 'firebase/firestore'

  import productNew from '@/components/dialog-product-new'
  import productEdit from '@/components/dialog-product-edit'
  import productDelete from '@/components/dialog-product-delete'

  export default {
    components: {
      productNew,
      productEdit,
      productDelete
    },
    data: () => ({
      newProductDialog: false,
      products:[],
      headers: [
        { text: 'Изображение', align: 'center',value: 'img'},
        { text: 'Название', align: 'center',value: 'name'},
        { text: 'Описание',align: 'center', value: 'description' },
        { text: 'Цена',align: 'center', value: 'price' },
        { text: 'Категория', align: 'center',value: 'category'},
        { text: 'Подкатегория', align: 'center',value: 'subcategory'}
      ],
    }),
    created () {
      this.loadProducts()
    },
    methods: {
      loadProducts() {
        firebase.firestore().collection('products')
          .onSnapshot(products => {
            let arr = [];

            products.forEach(product => {
              arr.push({
                ...product.data(),
                id: product.id
              });

              this.products = arr
              console.log(this.products)
            })
          })
      }

    }
  }
</script>
