import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';

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

  @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public toastCtrl:ToastController) {

    this.page =2;
    this.WooCommerce = WC({
      url: "http://afternoon-ravine-20342.herokuapp.com",
      consumerKey: "ck_b11071b5f55c591fb96e5aa743dbed35904eb762",
      consumerSecret: "cs_8d427f0177b797b333bbbd803ddebfb9beb21b41",
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

}
