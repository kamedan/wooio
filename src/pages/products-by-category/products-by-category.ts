import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
 import {ProductDetailsPage} from '../product-details/product-details';

import * as WC from 'woocommerce-api';

/**
 * Generated class for the ProductsByCategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {
  WooCommerce: any;
  products: any[];
  page:number;
  category:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.page = 1;
    this.category = this.navParams.get("category");

    this.WooCommerce = WC({
      url: "http://shop7895.000webhostapp.com",
      consumerKey: "ck_a4343f9fc555a69b21c85a61a658cd21050090fa",
      consumerSecret: "cs_19dbe0df3d905a25946073cb8e35c1a302ae7aa6",
      wpAPI: true,
      version: 'wc/v2'
    });

    this.WooCommerce.getAsync("products?filter[category]="+ this.category.slug).then((data) => {
      console.log(JSON.parse(data.body));
      
          this.products = JSON.parse(data.body);
    }, (err) => {
      console.log(err);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event){
    
      this.page++;

    this.WooCommerce.getAsync("products?filter[category]="+ this.category.slug + "&page" +this.page).then((data) => {
      console.log(JSON.parse(data.body));
      this.products = this.products.concat(JSON.parse(data.body));
      if(event != null)
      {
        event.complete();
      }

      if(JSON.parse(data.body).length < 10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No more products !",
          duration: 5000
        }).present();
      }


    }, (err) => {
      console.log(err);
    });

  }
  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage, {"product": product})
  }

}
