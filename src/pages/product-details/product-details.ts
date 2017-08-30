import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController  } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
import {CartPage} from '../cart/cart';


/**
 * Generated class for the ProductDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  product:any;
  WooCommerce: any;
  reviews:any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public toastCtrl: ToastController, public modalCtrl:ModalController) {

    this.product = this.navParams.get("product");
    console.log(this.product);

    this.WooCommerce = WC({
      url: "http://shop7895.000webhostapp.com",
      consumerKey: "ck_a4343f9fc555a69b21c85a61a658cd21050090fa",
      consumerSecret: "cs_19dbe0df3d905a25946073cb8e35c1a302ae7aa6",
      wpAPI: true,
      version: 'wc/v2'
    });

    this.WooCommerce.getAsync('products/'+this.product.id+'/reviews').then((data) => {
      console.log(JSON.parse(data.body));
      
          this.reviews = JSON.parse(data.body);
    }, (err) => {
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  addToCart(product){
    this.storage.get("cart").then((data) => {

      if(data == null || data.length == 0){
        data = [];
        data.push({
          "product" : product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });
      }else {
        let added = 0;
        for(let i =0; i<data.length; i++){
          if(product.id == data[i].product.id){
            console.log("product already in cart");

            let qty = data[i].qty;

            data[i].qty = qty + 1;
            data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
            added = 1;
          }
        }

        if(added == 0){
          data.push({
          "product" : product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });
        }
      }
      this.storage.set("cart", data).then((data)=> {
        console.log("cart updated");
        console.log(data);

        this.toastCtrl.create({
          message: "cart updated",
          duration: 5000
        }).present();
      })

    })
  }

  openCart(){
    this.modalCtrl.create(CartPage).present();
  }

}
