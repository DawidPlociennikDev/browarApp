import { Component, OnInit } from '@angular/core';
import { HelpersService } from '../services/helpers.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Md5 } from 'ts-md5/dist/md5';
import * as firebase from 'firebase';

@Component({
  selector: 'app-join-meeting',
  templateUrl: './join-meeting.page.html',
  styleUrls: ['./join-meeting.page.scss'],
})
export class JoinMeetingPage implements OnInit {

  code: number;
  status: string;
  isenabled: boolean;

  constructor(
    public help: HelpersService,
    private fs: AngularFirestore,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.status = '';
  }

  getCode(e) {
    this.isenabled = false;
    if (e.target.value.length >= 8) {
      this.code = e.target.value;
      this.isenabled = true;
    }
  }

  async checkCode() {
    this.help.presentLoading();
    const event = this.fs.collection('events', ref => ref.where('code', '==', this.code))
      .valueChanges()
      .subscribe(async (data) => {
      if (data.length > 0) {
        const eventMember = this.fs.collection('events-members', ref => ref
          .where('userId', '==', localStorage.getItem('userId'))
          .where('meetingId', '==', data[0]['id']))
          .valueChanges()
          .subscribe(async (data2) => {
          if (data2.length <= 0) {
            const alert = await this.alertController.create({
              header: 'Join to meeting',
              message: 'Are you sure you want join to metting ' + data[0]['name'] + '?',
              buttons: [{
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: (blah) => {}
                }, {
                  text: 'Okay',
                  handler: () => { this.joinMeeting(data[0]['id'], this.code); }
                }]
            });
            await alert.present();
          } else {
            this.status = 'You already joined to this meeting.';
          }
          eventMember.unsubscribe();
        });
      } else {
        this.status = 'Wrong meeting code.';
      }
      this.help.dismissLoading();
      event.unsubscribe();
    });
  }

  joinMeeting(meetingId, code) {
    const time = firebase.firestore.FieldValue.serverTimestamp();
    const docId = Md5.hashStr(time + '|' + meetingId + '|' + localStorage.getItem('userId')).toString();
    this.fs.collection('events-members').doc(docId).set({
      id: docId,
      userId: localStorage.getItem('userId'),
      meetingId: meetingId,
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      avatar: localStorage.getItem('avatar'),
      email: localStorage.getItem('email'),
      code: code,
      timestamp: time
    }).then(() => {
      this.help.presentLoading();
      this.help.toastInfo('You joined to meeting!');
      this.help.dismissLoading();
      this.help.navParam('event', meetingId);
    }).catch((error) => {
      this.status = JSON.stringify(error);
    });
  }
}
