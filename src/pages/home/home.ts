import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';
 import {ProductDetailsPage} from '../product-details/product-details';

 import {SearchPage} from '../search/search';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreProducts: any[];
  page:number;
  searchQuery:string = "";

  @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public toastCtrl:ToastController) {

    this.page =2;
    this.WooCommerce = WC({
      url: "http://shop7895.000webhostapp.com",
      consumerKey: "ck_a4343f9fc555a69b21c85a61a658cd21050090fa",
      consumerSecret: "cs_19dbe0df3d905a25946073cb8e35c1a302ae7aa6",
      wpAPI: true,
      version: 'wc/v2'
    });

    this.WooCommerce.getAsync("products").then((data) => {
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body);
    }, (err) => {
      console.log(err);
    });

    this.loadMoreProducts(null);

  }

  ionViewDidLoad(){
    setInterval(()=>{
      if(this.productSlides.getActiveIndex() == this.productSlides.length() -1){
        this.productSlides.slideTo(0);
      }
      this.productSlides.slideNext();
    },3000);
  }

  loadMoreProducts(event){
    if(event == null)
    {
      this.page = 2;
      this.moreProducts = [];
    }else{
      this.page++;
    }

    this.WooCommerce.getAsync("products?page="+this.page).then((data) => {
      console.log(JSON.parse(data.body));
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body));
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

  onSearch(event){
    if(this.searchQuery.length>0){
      this.navCtrl.push(SearchPage, {"searchQuery": this.searchQuery});
    }
  }

}
