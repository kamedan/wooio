import { Component } from '@angular/core';
import { NavController, NavParams, ToastController  } from 'ionic-angular';
import * as WC from 'woocommerce-api';
 import {ProductDetailsPage} from '../product-details/product-details';

/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchQuery:string = "";
  WooCommerce:any;
  products: any[];
  page: number = 2;

  constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl: ToastController) {

    this.searchQuery = this.navParams.get("searchQuery");

    this.WooCommerce = WC({
      url: "http://shop7895.000webhostapp.com",
      consumerKey: "ck_a4343f9fc555a69b21c85a61a658cd21050090fa",
      consumerSecret: "cs_19dbe0df3d905a25946073cb8e35c1a302ae7aa6",
      wpAPI: true,
      version: 'wc/v2'
    });

    this.WooCommerce.getAsync("products?search="+this.searchQuery).then((searchData) => {
      this.products = JSON.parse(searchData.body);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  loadMoreProducts(event){

    this.WooCommerce.getAsync("products?search=" + this.searchQuery + "&page=" + this.page).then((searchData) => {
      this.products = this.products.concat(JSON.parse(searchData.body));

      console.log(this.products);

      if(JSON.parse(searchData.body).length < 10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No more products!",
          duration: 5000
        }).present();

      }

      event.complete();
      this.page ++;

    });
  }

  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage, {"product": product})
  }

}
