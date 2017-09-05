import { Component, ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import {HomePage} from '../home/home';
import {ProductsByCategoryPage} from '../products-by-category/products-by-category';
import {CartPage} from '../cart/cart';
import {SignupPage} from '../signup/signup';
import {LoginPage} from '../login/login';
import { Storage } from '@ionic/storage';

import * as WC from 'woocommerce-api';

/**
 * Generated class for the MenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({})
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  homePage:Component;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavController: NavController;
  loggedIn:boolean;
  user:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController, private events: Events) {
    this.homePage = HomePage;

    this.categories = [];
    this.user = {};

    this.WooCommerce = WC({
      url: "http://shop7895.000webhostapp.com",
      consumerKey: "ck_a4343f9fc555a69b21c85a61a658cd21050090fa",
      consumerSecret: "cs_19dbe0df3d905a25946073cb8e35c1a302ae7aa6",
      wpAPI: true,
      version: 'wc/v2'
    });


    this.WooCommerce.getAsync("products/categories").then((data) => {
      console.log(JSON.parse(data.body));
      let temp:any[] = JSON.parse(data.body);

      for(let i =0;i<temp.length; i++){
        if(temp[i].parent == 0){
          if(temp[i].slug == "clothing"){
            temp[i].icon = "shirt";
          }
          if(temp[i].slug == "music"){
            temp[i].icon = "musical-notes";
          }
          if(temp[i].slug == "posters"){
            temp[i].icon = "images";
          }
          this.categories.push(temp[i]);
          console.log(this.categories)
        }
      }
    }, (err) => {
      console.log(err);
    });

  }

  ionViewDidEnter() {

    this.storage.ready().then(() => {
      this.storage.get("userLoginInfo").then((userLoginInfo) => {

        if (userLoginInfo != null) {

          console.log("User logged in...");
          this.user = userLoginInfo.user;
          console.log(this.user);
          this.loggedIn = true;
        }
        else {
          console.log("No user found.");
          this.user = {};
          this.loggedIn = false;
        }

      })
    })


  }

  openCategoryPage(category){
    this.childNavController.setRoot(ProductsByCategoryPage, {"category": category});
  }

  openPage(pageName:string){
    if (pageName == "signup") {
      this.navCtrl.push(SignupPage);
    }
    if (pageName == "login") {
      this.navCtrl.push(LoginPage);
    }
    if (pageName == 'logout') {
      this.storage.remove("userLoginInfo").then(() => {
        this.user = {};
        this.loggedIn = false;
      })
    }
    if (pageName == 'cart') {
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }
  }

}
