import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { HelpersService } from '../services/helpers.service';
import { ModalController } from '@ionic/angular';
import { AddProductModalPage } from '../modal/add-product-modal/add-product-modal.page';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AlertController } from '@ionic/angular';
import { EditProductModalPage } from '../modal/edit-product-modal/edit-product-modal.page';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.page.html',
  styleUrls: ['./add-products.page.scss'],
})
export class AddProductsPage implements OnInit {

  eventId: string;
  status: string;
  beers: any;
  name: string;
  subBeers: any;

  @ViewChild('slideList', {read: ElementRef}) slide: ElementRef;

  constructor(
    private fs: AngularFirestore,
    public help: HelpersService,
    private route: ActivatedRoute,
    private clipboard: Clipboard,
    public modalController: ModalController,
    public alertController: AlertController,
  ) {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    this.beers = this.fs.collection('beers', ref => ref
      .where('eventId', '==', this.eventId)
      .orderBy('timestamp'))
      .valueChanges();
    this.subBeers = this.beers.subscribe(data => {
      if (data.length > 0) {
        setTimeout( () => {
          this.openSlideItem();
          if (this.subBeers) {
            this.subBeers.unsubscribe();
          }
        }, 1000);
      }
    });
  }

  ngOnInit() {
    console.log(this.eventId);
  }

  ionViewWillLeave() {
    if (this.subBeers) {
      this.subBeers.unsubscribe();
    }
  }

  copyCode(code) {
    this.help.toastInfo('Code was copied');
    this.clipboard.copy(code);
  }

  async deleteBeer(beerId) {
    const alert = await this.alertController.create({
      header: 'Delete beer',
      message: 'Are you sure you want delete this beer?',
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Okay',
          handler: () => {
            this.help.presentLoading();
            this.fs.collection('beers').doc(beerId).delete().then(data => {
            this.help.dismissLoading();
            this.help.toastInfo('Event was deleted');
            });
          }
        }]
    });
    await alert.present();
  }

  async addProductOpenModal() {
    const modal = await this.modalController.create({
      component: AddProductModalPage,
      componentProps: {
        'meetingId': this.eventId,
      }
    });
    return await modal.present();
  }

    async editProductOpenModal(beerId) {
    const modal = await this.modalController.create({
      component: EditProductModalPage,
      componentProps: {
        'beerId': beerId,
      }
    });
    return await modal.present();
  }

  async openSlideItem(): Promise<number> {
    const item = this.slide.nativeElement;
    if (item && item.open) {
      setTimeout( () => {
        this.closeSlideItem();
      }, 1500);
      return item.open();
    }
  }

  async closeSlideItem(): Promise<boolean> {
    const item = this.slide.nativeElement;
    if (item && item.closeOpened) {
      return item.closeOpened();
    }
  }

}
