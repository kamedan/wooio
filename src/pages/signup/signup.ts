import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import {LoginPage} from '../login/login';

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  newUser: any = {};
  billing_shipping_same: boolean;
  WooCommerce: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl:ToastController, public alertCtrl: AlertController) {

    this.newUser.billing_address = {};
    this.newUser.shipping_address = {};
    this.billing_shipping_same = false; 

    this.WooCommerce = WC({
      url: "http://shop7895.000webhostapp.com",
      consumerKey: "ck_a4343f9fc555a69b21c85a61a658cd21050090fa",
      consumerSecret: "cs_19dbe0df3d905a25946073cb8e35c1a302ae7aa6",
      wpAPI: true,
      version: 'wc/v2'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  setBillingToShipping(){
    this.billing_shipping_same = !this.billing_shipping_same;

  }
  signup(){

      let customerData = {
        customer : {}
      }

      let datac = {
  email: this.newUser.email,
  first_name: this.newUser.first_name,
  last_name: this.newUser.last_name,
  username: this.newUser.username,
  password: this.newUser.password,
  billing: {
    first_name: this.newUser.first_name,
    last_name: this.newUser.last_name,
    company: '',
    address_1: this.newUser.billing_address.address_1,
    address_2: this.newUser.billing_address.address_2,
    city: this.newUser.billing_address.city,
    state: this.newUser.billing_address.state,
    postcode: this.newUser.billing_address.postcode,
    country: this.newUser.billing_address.country,
    email: this.newUser.email,
    phone: this.newUser.billing_address.phone
  },
  shipping: {
    first_name: this.newUser.first_name,
    last_name: this.newUser.last_name,
    company: '',
    address_1: this.newUser.shipping_address.address_1,
    address_2: this.newUser.shipping_address.address_2,
    city: this.newUser.shipping_address.city,
    state: this.newUser.shipping_address.state,
    postcode: this.newUser.shipping_address.postcode,
    country: this.newUser.shipping_address.country,
    email: this.newUser.email,
    phone: this.newUser.shipping_address.phone
  }
};

      /*customerData.customer = {
        "email": this.newUser.email,
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "username": this.newUser.username,
        "password": this.newUser.password,
        "billing_address": {
          "first_name": this.newUser.first_name,
          "last_name": this.newUser.last_name,
          "company": "",
          "address_1": this.newUser.billing_address.address_1,
          "address_2": this.newUser.billing_address.address_2,
          "city": this.newUser.billing_address.city,
          "state": this.newUser.billing_address.state,
          "postcode": this.newUser.billing_address.postcode,
          "country": this.newUser.billing_address.country,
          "email": this.newUser.email,
          "phone": this.newUser.billing_address.phone
        },
        "shipping_address": {
          "first_name": this.newUser.first_name,
          "last_name": this.newUser.last_name,
          "company": "",
          "address_1": this.newUser.shipping_address.address_1,
          "address_2": this.newUser.shipping_address.address_2,
          "city": this.newUser.shipping_address.city,
          "state": this.newUser.shipping_address.state,
          "postcode": this.newUser.shipping_address.postcode,
          "country": this.newUser.shipping_address.country
        }
      }
      */

      if(this.billing_shipping_same){
        this.newUser.shipping = this.newUser.billing;
      }

      console.log(customerData);

      this.WooCommerce.postAsync('customers', datac).then( (data) => {

        let response = (JSON.parse(data.body));
        console.log(data);

        if(response.id){
          this.alertCtrl.create({
            title: "Account Created",
            message: "Your account has been created successfully! Please login to proceed.",
            buttons: [{
              text: "Login",
              handler: ()=> {
                //TODO
                this.navCtrl.push(LoginPage);
              }
            }]
          }).present();
        } else if(response.errors){
          this.toastCtrl.create({
            message: response.errors[0].message,
            showCloseButton: true
          }).present();
        }

      })

    }

  checkEmail(){

    let validEmail = false;

    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(reg.test(this.newUser.email)){
      //email looks valid

      this.toastCtrl.create({
            message: "Congratulations. Email is good to go.",
            duration: 3000
          }).present();

     /* this.WooCommerce.getAsync("customers/email/" + this.newUser.email).then((data) => {

        console.log(data);
        let res = (JSON.parse(data.body));

        if(res.errors){
          validEmail = true;

          this.toastCtrl.create({
            message: "Congratulations. Email is good to go.",
            duration: 3000
          }).present();

        } else {
          validEmail = false;

          this.toastCtrl.create({
            message: "Email already registered. Please check.",
            showCloseButton: true
          }).present();
        }

        console.log(validEmail);

      })*/



    } else {
      validEmail = false;
      this.toastCtrl.create({
        message: "Invalid Email. Please check.",
        showCloseButton: true
      }).present();
      console.log(validEmail);
    }

  }

}
