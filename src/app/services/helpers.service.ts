import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  loading: any;
  constructor(
    public navCtrl: NavController,
    public loadingController: LoadingController
  ) { }

  nav(param) {
    this.navCtrl.navigateForward('/' + param);
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  async dismissLoading() {
    await this.loading.dismiss();
  }
}
