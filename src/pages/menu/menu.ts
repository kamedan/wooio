import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import {HomePage} from '../home/home';

import * as WC from 'woocommerce-api';

/**
 * Generated class for the MenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  homePage:Component;
  WooCommerce: any;
  categories: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = HomePage;

    this.categories = [];

    this.WooCommerce = WC({
      url: "http://afternoon-ravine-20342.herokuapp.com",
      consumerKey: "ck_b11071b5f55c591fb96e5aa743dbed35904eb762",
      consumerSecret: "cs_8d427f0177b797b333bbbd803ddebfb9beb21b41",
      wpAPI: true,
      version: 'wc/v2'
    });


    this.WooCommerce.getAsync("products/categories").then((data) => {
      console.log(JSON.parse(data.body));
      let temp:any[] = JSON.parse(data.body);

      for(let i =0;i<temp.length; i++){
        if(temp[i].parent == 0){
          this.categories.push(temp[i]);
          console.log(this.categories)
        }
      }
    }, (err) => {
      console.log(err);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

}
