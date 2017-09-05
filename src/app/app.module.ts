import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule }   from '@angular/forms';
import {HttpModule} from '@angular/http';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import {ProductsByCategoryPage} from '../pages/products-by-category/products-by-category';
import {ProductDetailsPage} from '../pages/product-details/product-details';
import {CartPage} from '../pages/cart/cart';

import {SignupPage} from '../pages/signup/signup';
import {LoginPage} from '../pages/login/login';
import {CheckoutPage} from '../pages/checkout/checkout';
 import {SearchPage} from '../pages/search/search';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

import { OneSignal } from '@ionic-native/onesignal';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProductsByCategoryPage,
    ProductDetailsPage,
    CartPage,
    SignupPage,
    LoginPage,
    CheckoutPage,
    SearchPage
    

  ],
  imports: [
    BrowserModule,
    HttpModule,
     FormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProductsByCategoryPage,
    ProductDetailsPage,
    CartPage,
    SignupPage,
    LoginPage,
    CheckoutPage,
    SearchPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
