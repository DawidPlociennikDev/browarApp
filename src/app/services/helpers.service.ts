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

  nav(page) {
    this.navCtrl.navigateForward('/' + page);
  }

  navParam(page, param) {
    this.navCtrl.navigateForward('/' + page + '/' + param);
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 3000
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  async toastInfo(content) {
    const toast = await this.toastCtrl.create({
      duration: 3000,
      message: content
    });
    toast.present();
  }
}
