import { Component, OnInit } from '@angular/core';
import { HelpersService } from '../services/helpers.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.page.html',
  styleUrls: ['./hub.page.scss'],
})
export class HubPage implements OnInit {
  avatar: string;
  firstName: string;
  lastName: string;
  constructor(
    public help: HelpersService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.avatar = localStorage.getItem('avatar');
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
  }

  goToPage(page) {
    this.help.nav(page);
  }

  async logOut() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Logout',
      message: 'Are you sure want logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            localStorage.clear();
            this.help.nav('home');
          }
        }
      ]
    });
    await alert.present();
  }
}
