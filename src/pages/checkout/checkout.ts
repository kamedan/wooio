import { Component } from '@angular/core';
import {NavController, NavParams, AlertController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import {Storage} from '@ionic/storage';
import {HomePage} from '../home/home';


/**
 * Generated class for the CheckoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})

export class CheckoutPage {

  newOrder: any = {};
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  WooCommerce: any;
  userInfo: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController) {
    this.newOrder = {};
    this.newOrder.billing = {};
    this.newOrder.shipping = {};
    this.billing_shipping_same = false; 

    this.paymentMethods = [
      {method_id: "bacs", method_title: "Direct Bank Transfer"},
      {method_id: "cheque", method_title: "Cheque Payment"},
      {method_id: "cod", method_title: "Cash on Delivery"},
      {method_id: "paypal", method_title: "Paypal"},
    ];

    this.WooCommerce = WC({
      url: "http://shop7895.000webhostapp.com",
      consumerKey: "ck_a4343f9fc555a69b21c85a61a658cd21050090fa",
      consumerSecret: "cs_19dbe0df3d905a25946073cb8e35c1a302ae7aa6",
      wpAPI: true,
      version: 'wc/v2'
    });

    this.storage.get("userLoginInfo").then((userLoginInfo) => {
      console.log("userLoginInfo => ",userLoginInfo);

      this.userInfo = userLoginInfo.user;

      let id = userLoginInfo.user.id;

      this.WooCommerce.getAsync("customers/" + id).then((data) => {
        console.log("data ==>", data);
        this.newOrder = JSON.parse(data.body);
       

      })

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

  setBillingToShipping(){
    this.billing_shipping_same = !this.billing_shipping_same;

    if(this.billing_shipping_same){
      this.newOrder.shipping = this.newOrder.billing;
    }
  }

  placeOrder(){
    let orderItems: any[] = [];
    let data: any = {};

    let paymentData: any = {};

    this.paymentMethods.forEach((element, index) => {
      if(element.method_id == this.paymentMethod){
        paymentData = element;
      }
    });

    data = {
      payment_details: {
        method_id: paymentData.method_id,
        method_title: paymentData.method_title,
        paid:true,
      },
      biling: this.newOrder.billing,
      shipping: this.newOrder.shipping,
      customer_id: this.userInfo.id || '',
      line_items: orderItems
    };


    if(paymentData.method_id == "paypal"){
      //todo
    }else{
      this.storage.get("cart").then((cart) => {

        cart.forEach((element, index) => {
          orderItems.push({
            product_id: element.product.id,
            quantity: element.qty
          });
        });

        data.line_items = orderItems;

        let orderData: any = {};

        orderData = data;

        this.WooCommerce.postAsync("orders", orderData).then((data) => {

          let response = (JSON.parse(data.body));

          console.log(response);

          this.alertCtrl.create({
            title: "Order Placed Successfully",
            message: "Your order has been placed successfully. Your order number is " + response.order_number,
            buttons: [{
              text: "OK",
              handler: () => {
                this.navCtrl.setRoot(HomePage);
              }
            }]
          }).present();

        });

      });
    }
  }



}
