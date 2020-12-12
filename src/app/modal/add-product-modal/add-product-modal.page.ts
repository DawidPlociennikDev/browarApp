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
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.page.html',
  styleUrls: ['./add-product-modal.page.scss'],
})
export class AddProductModalPage implements OnInit {

  @Input() eventId: string;
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
    });
  }

  ngOnInit() {
    this.photo = '../../../assets/example_beer2.jpg';
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

  addProduct() {
    if (this.validFields() === true) {
      this.help.presentLoading();
      const time = firebase.firestore.FieldValue.serverTimestamp();
      const docId = Md5.hashStr(time + '|' + this.barcode + '|' + this.name).toString();
      this.fs.collection('beers').doc(docId).set({
        id: docId,
        userId: localStorage.getItem('userId'),
        eventId: this.eventId,
        name: this.name,
        barcode: this.barcode,
        percent: this.percent,
        blg: this.blg,
        country: this.country,
        manufacture: this.manufacture,
        description: this.description,
        photo: this.photo,
        timestamp: time
      }).then(async () => {
        this.help.dismissLoading();
        this.help.toastInfo('Bear was added');
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
