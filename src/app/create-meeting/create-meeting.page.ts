import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { HelpersService } from '../services/helpers.service';
import { Md5 } from 'ts-md5/dist/md5';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.page.html',
  styleUrls: ['./create-meeting.page.scss'],
})
export class CreateMeetingPage implements OnInit {

  status: string;
  avatar: string;
  name: string;
  date: string;
  hour: string;
  address: string;
  minDate: any;

  constructor(
    private datePipe: DatePipe,
    private fs: AngularFirestore,
    private storage: AngularFireStorage,
    public help: HelpersService,
    private file: File,
  ) { }

  ngOnInit() {
    this.status = '';
    this.avatar = 'https://firebasestorage.googleapis.com/v0/b/browarapp.appspot.com/o/example_beer.jpg?alt=media&token=88798838-5ad4-4980-bae3-5c9d4f4ba714';
    this.minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.name = '';
    this.date = '';
    this.hour = '';
    this.address = '';
  }

  validFields() {
    if (
      this.name != null &&
      this.date != null &&
      this.hour != null &&
      this.address != null
    ) {
      return true;
    } else {
      return false;
    }
  }

  addEvent() {
    if (this.validFields() === true) {
      this.help.presentLoading();
      const randomCode = Math.floor(Math.random() * 99999999 + 10000000).toString();
      const checkCode = this.fs.collection('events', ref => ref.where('code', '==', randomCode))
        .valueChanges()
        .subscribe(async (data) => {
        if (data.length <= 0) {
          checkCode.unsubscribe();
          const time = firebase.firestore.FieldValue.serverTimestamp();
          const docId = Md5.hashStr(time + '|' + this.name + '|' + localStorage.getItem('userId')).toString();
          this.fs.collection('events').doc(docId).set({
            id: docId,
            userId: localStorage.getItem('userId'),
            name: this.name,
            date: this.date,
            hour: this.hour,
            address: this.address,
            avatar: this.avatar,
            code: randomCode,
            timestamp: time
          }).then(() => {
            this.help.dismissLoading();
            this.help.toastInfo('Event was created');
            this.help.nav('hub');
          }).catch((error) => {
            this.status = JSON.stringify(error);
          });
        } else {
          checkCode.unsubscribe();
          this.help.dismissLoading();
          this.addEvent();
        }
      });
    } else {
      this.status = 'All fields are required';
    }
  }

  async uploadPhoto(e) {
    this.avatar = '../../assets/loader_beer.gif';
    const prefixFiletype = e.target.files[0].type.toString();
    if (prefixFiletype.indexOf('image/') === 0) {
      this.file = e.target.files[0];
      const randomId = Math.random().toString(36).substring(2, 8);
      const uploadTask = this.storage.ref(`${localStorage.getItem('userId')}/${randomId}_${this.file['name']}`).put(this.file);
      uploadTask.then((res) => {
        res.ref.getDownloadURL().then((downloadUrl) => {
          this.file = null;
          this.avatar = downloadUrl;
        });
      });
    } else {
      this.status = 'This file is not a image!';
    }
  }

}
