import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HelpersService } from '../services/helpers.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.page.html',
  styleUrls: ['./meetings.page.scss'],
})
export class MeetingsPage implements OnInit {

  status: string;
  status2: string;
  events: any;
  joinedEvents: any;
  joinedEventsArray = [];
  subEvents: any;
  subJoinedEvents: any;
  selected: number;

  subDelete: any;
  subJoined: any;

  @ViewChild('slideList', {read: ElementRef}) slide: ElementRef;

  constructor(
    private fs: AngularFirestore,
    public help: HelpersService,
    private clipboard: Clipboard,
    public alertController: AlertController,
  ) {
    this.selected = 0;
  }

  ngOnInit() {
    this.help.presentLoading();
    this.status = '';
    this.status2 = '';
    this.events = this.fs.collection('events', ref => ref
      .where('userId', '==', localStorage.getItem('userId'))
      .orderBy('timestamp'))
      .valueChanges();
    this.subEvents = this.events.subscribe((data) => {
      if (data.length <= 0) {
        this.status = 'You don`t have created events yet.';
      }
      setTimeout( () => {
        this.openSlideItem();
      }, 1000);
      this.help.dismissLoading();
    });

    this.getJoinedEvents();
  }

  getJoinedEvents() {
    this.joinedEventsArray = [];
    this.joinedEvents = this.fs.collection('events-members', ref => ref
      .where('userId', '==', localStorage.getItem('userId'))
      .orderBy('timestamp'))
      .valueChanges();
    this.subJoinedEvents = this.joinedEvents.subscribe((data) => {
      if (data.length <= 0) {
        this.status2 = 'You don`t have joined events yet';
      } else {
        let j = 0;
        data.forEach(element => {
          const eventDetails = this.fs.collection('events', ref => ref
            .where('id', '==', element['meetingId']))
            .valueChanges()
            .subscribe(details => {
              console.log(j, details);
              this.joinedEventsArray[j] = details[0];
              j++;
              eventDetails.unsubscribe();
            });
        });
        console.log('array', this.joinedEventsArray);
      }
      this.help.dismissLoading();
    });
  }

  ionViewWillLeave() {
    if (this.subEvents) {
      this.subEvents.unsubscribe();
    }
    if (this.subJoinedEvents) {
      this.subJoinedEvents.unsubscribe();
    }
    if (this.subDelete) {
      this.subDelete.unsubscribe();
    }
    if (this.subJoined) {
      this.subJoined.unsubscribe();
    }
  }

  copyCode(code) {
    this.help.toastInfo('Code was copied');
    this.clipboard.copy(code);
  }

  async deleteMeeting(meetingId) {
    const alert = await this.alertController.create({
      header: 'Delete meeting',
      message: 'Are you sure you want delete this meeting?',
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Okay',
          handler: () => {
            this.help.presentLoading();
            this.fs.collection('events').doc(meetingId).delete().then(data => {
            this.subDelete = this.fs.collection('events-members', ref => ref.where('meetingId', '==', meetingId))
              .snapshotChanges().subscribe((res: any) => {
                res.forEach(element => {
                  this.fs.collection('events-members').doc(element.payload.doc.id).delete();
                  this.help.dismissLoading();
                });
              });
            this.help.toastInfo('Event was deleted');
            });
          }
        }]
    });
    await alert.present();
  }

  async leaveMeeting(meetingId) {
    const alert = await this.alertController.create({
      header: 'Leave meeting',
      message: 'Are you sure you want leave this meeting?',
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Okay',
          handler: () => {
          this.help.presentLoading();
            this.subJoined = this.fs.collection('events-members', ref => ref
              .where('userId', '==', localStorage.getItem('userId'))
              .where('meetingId', '==', meetingId))
              .snapshotChanges().subscribe((res: any) => {
              this.fs.collection('events-members').doc(res[0].payload.doc.id).delete().then((data) => {
                this.getJoinedEvents();
                this.help.toastInfo('Event was leaved');
                this.help.dismissLoading();
              });
            });
          }
        }]
    });
    await alert.present();
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

  goToEvent(meetingId) {
    this.help.navParam('event', meetingId);
  }

  editMeeting(meetingId) {
    this.help.navParam('edit-meeting', meetingId);
  }

}
