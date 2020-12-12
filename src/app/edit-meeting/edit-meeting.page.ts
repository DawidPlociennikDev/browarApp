import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { HelpersService } from '../services/helpers.service';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.page.html',
  styleUrls: ['./edit-meeting.page.scss'],
})
export class EditMeetingPage implements OnInit {

  status: string;
  avatar: string;
  name: string;
  date: string;
  hour: string;
  address: string;
  minDate: any;
  meetingId: string;

  constructor(
    private datePipe: DatePipe,
    private fs: AngularFirestore,
    private storage: AngularFireStorage,
    public help: HelpersService,
    private file: File,
    private route: ActivatedRoute,
  ) {
    this.meetingId = this.route.snapshot.paramMap.get('meetingId');
  }

  ngOnInit() {
    this.status = '';
    this.minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const getData = this.fs.collection('events', ref => ref.where('id', '==', this.meetingId))
      .valueChanges()
      .subscribe((data) => {
        this.name = data[0]['name'];
        this.date = data[0]['date'];
        this.hour = data[0]['hour'];
        this.address = data[0]['address'];
        this.avatar = data[0]['avatar'];
        getData.unsubscribe();
      });
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

  editEvent(products = null) {
    if (this.validFields() === true) {
      this.help.presentLoading();
      this.fs.collection('events').doc(this.meetingId).update({
        name: this.name,
        date: this.date,
        hour: this.hour,
        address: this.address,
        avatar: this.avatar,
      }).then(() => {
        if (products === true) {
          this.help.dismissLoading();
          this.help.toastInfo('Event was updated');
          this.help.navParam('add-products', this.meetingId);
        }
        else {
          this.help.dismissLoading();
          this.help.toastInfo('Event was updated');
        }
      }).catch((error) => {
        this.status = JSON.stringify(error);
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
