import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { HelpersService } from '../../services/helpers.service';
import { Md5 } from 'ts-md5/dist/md5';
import { File } from '@ionic-native/file/ngx';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/environments/environment';

@Component({
  selector: 'app-edit-product-modal',
  templateUrl: './edit-product-modal.page.html',
  styleUrls: ['./edit-product-modal.page.scss'],
})

export class EditProductModalPage implements OnInit {

  @Input() beerId: string;
  docId: string;
  eventId: string;
  status: string;
  name: string;
  barcode: string;
  percent: string;
  blg: string;
  country: string;
  manufacture: string;
  description: string;
  photo: string;
  countriesArray: any;
  
  constructor(
    private fs: AngularFirestore,
    private storage: AngularFireStorage,
    public help: HelpersService,
    private file: File,
    public modalController: ModalController,
    private httpClient: HttpClient
  ) {
    this.httpClient.get(apiUrl + 'api/countries/get_all').subscribe((res) => {
      this.countriesArray = res['data'];
      const getData = this.fs.collection('beers', ref => ref.where('id', '==', this.beerId))
        .valueChanges()
        .subscribe((data) => {
          this.docId = data[0]['id'];
          this.name = data[0]['name'];
          this.barcode = data[0]['barcode'];
          this.percent = data[0]['percent'];
          this.blg = data[0]['blg'];
          this.country = data[0]['country'];
          this.manufacture = data[0]['manufacture'];
          this.description = data[0]['description'];
          this.photo = data[0]['photo'];
          getData.unsubscribe();
        });
    });
  }

  ngOnInit() {
    this.status = '';
  }

  validFields() {
    if (
      this.name !== '' &&
      this.barcode !== '' &&
      this.percent !== '' &&
      this.blg !== '' &&
      this.country !== '' &&
      this.manufacture !== '' &&
      this.description !== ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  editProduct() {
    if (this.validFields() === true) {
      this.help.presentLoading();
      this.fs.collection('beers').doc(this.docId).update({
        name: this.name,
        barcode: this.barcode,
        percent: this.percent,
        blg: this.blg,
        country: this.country,
        manufacture: this.manufacture,
        description: this.description,
        photo: this.photo
      }).then(async () => {
        this.help.dismissLoading();
        this.help.toastInfo('Bear was updated');
        this.dismiss();
      }).catch((error) => {
        this.status = JSON.stringify(error);
      });
    } else {
      this.status = 'All fields are required';
    }
  }

  async uploadPhoto(e) {
    this.photo = '../../assets/loader_beer.gif';
    const prefixFiletype = e.target.files[0].type.toString();
    if (prefixFiletype.indexOf('image/') === 0) {
      this.file = e.target.files[0];
      const randomId = Math.random().toString(36).substring(2, 8);
      const uploadTask = this.storage.ref(`${this.eventId}/${randomId}_${this.file['name']}`).put(this.file);
      uploadTask.then((res) => {
        res.ref.getDownloadURL().then((downloadUrl) => {
          this.file = null;
          this.photo = downloadUrl;
        });
      });
    } else {
      this.status = 'This file is not a image!';
    }
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

}
