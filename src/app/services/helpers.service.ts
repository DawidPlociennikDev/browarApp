import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  loading: any;
  constructor(
    public navCtrl: NavController,
    public loadingController: LoadingController,
    private toastCtrl: ToastController,
  ) { }

  nav(param) {
    this.navCtrl.navigateForward('/' + param);
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 10000
    });
    await this.loading.present();
  }

  async dismissLoading() {
    await this.loading.dismiss();
  }

  async toastInfo(content) {
    const toast = await this.toastCtrl.create({
      duration: 3000,
      message: content
    });
    toast.present();
  }
}
