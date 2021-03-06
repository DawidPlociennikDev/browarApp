import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { HelpersService } from '../services/helpers.service';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { UsersListPage } from '../modal/users-list/users-list.page';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../component/popover/popover.component';
import * as firebase from 'firebase';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  eventId: string;
  name: string;
  date: string;
  hour: string;
  address: string;
  avatar: string;
  active: boolean
  owner: string;
  userId: string;
  checkInApproved: number;
  eventStartSeconds: number;

  userJoined: number;
  userConfirm: number;

  subEvents: any;
  subUsersJoined: any;
  subUsersConfirmed: any;
  subCheckIn: any;
  subCountBeers: any;
  interval: any;

  eventStarted: boolean;

  beers: any;
  rateTaste: number;
  rateLook: number;
  rateCraft: number;
  ratePower: number;

  showBeer: number;
  countBeers: number

  constructor(
    private fs: AngularFirestore,
    public help: HelpersService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public modalController: ModalController,
    private elementRef: ElementRef,
    public alertController: AlertController,
    public popoverController: PopoverController
  ) {
    this.eventId = this.route.snapshot.paramMap.get('meetingId');
    this.userJoined = 0;
    this.userConfirm = 0;
    this.userId = localStorage.getItem('userId');
    this.eventStarted = false;
    this.rateTaste = 0;
    this.rateLook = 0;
    this.rateCraft = 0;
    this.ratePower = 0;
    this.subCheckIn = this.fs.collection('events-members', ref => ref.where('userId', '==', localStorage.getItem('userId')).where('meetingId', '==', this.eventId))
      .valueChanges()
      .subscribe((data) => {
        if (data.length > 0) {
          this.checkInApproved = data[0]['checkIn'];
        }
      });
  }

  ngOnInit() {
    this.help.presentLoading();
    this.subEvents = this.fs.collection('events', ref => ref.where('id', '==', this.eventId))
      .valueChanges()
      .subscribe((data) => {
        this.name = data[0]['name'];
        this.date = data[0]['date'];
        this.hour = data[0]['hour'];
        this.address = data[0]['address'];
        this.avatar = data[0]['avatar'];
        this.active = data[0]['active'];
        this.owner = data[0]['userId'];
        this.eventStarted = data[0]['start'];

        if (this.eventStarted === false) {
          const transformDate = this.datePipe.transform(data[0]['date'], 'yyyy-MM-dd');
          const dateEvent = new Date(transformDate).getTime();
          let hoursEvent = this.datePipe.transform(data[0]['hour'], 'HH:mm');
          const a = hoursEvent.split(':');
          const seconds = (+a[0] - 1) * 60 * 60 + (+a[1]) * 60;
          hoursEvent = (seconds * 1000).toString();

          this.eventStartSeconds = Math.floor(dateEvent + parseInt(hoursEvent, 10));
          this.countDown();
        } else {
          this.renderBeers();
        }

        this.subEvents.unsubscribe();
        this.help.dismissLoading();
      });
  }

  ionViewWillEnter() {
    this.subUsersJoined = this.fs.collection('events-members', ref => ref.where('meetingId', '==', this.eventId))
      .valueChanges()
      .subscribe((data) => {
        this.userJoined = data.length;
      });
    this.subUsersConfirmed = this.fs.collection('events-members', ref => ref.where('meetingId', '==', this.eventId).where('checkIn', '==', 1))
      .valueChanges()
      .subscribe((data) => {
        this.userConfirm = data.length;
      });
  }

  countDown() {
    const countDownDate = this.eventStartSeconds;
    const eventOwner = this.owner;
    const userId = this.userId;
    const checkInApproved = this.checkInApproved;
    let endCount = false;
    const interval = setInterval(function() {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let hoursTxt = hours.toString();
      let minutesTxt = minutes.toString();
      let secondsTxt = seconds.toString();
      if (hours   < 10) { hoursTxt   = '0' + hours; }
      if (minutes < 10) { minutesTxt = '0' + minutes; }
      if (seconds < 10) { secondsTxt = '0' + seconds; }

      if (days > 1) {
        document.getElementById('countTime').innerHTML = days + ' days<br>' + hoursTxt + ':' + minutesTxt + ':' + secondsTxt;
      } else {
        document.getElementById('countTime').innerHTML = hoursTxt + ':' + minutesTxt + ':' + secondsTxt;
      }
      if (distance < 0) {
        clearInterval(interval);
        endCount = true;
        if (eventOwner === userId) {
          document.getElementById('countTime').innerHTML = '<ion-button id="startEvent">Start Event</ion-button>';
        } else {
          if (checkInApproved === 1) {
            document.getElementById('countTime').innerHTML = '<ion-button color="success">Checked In</ion-button><br><small>Wait for start</small>';
          } else {
            document.getElementById('countTime').innerHTML = '<ion-button id="checkIn">Check In</ion-button>';
          }
        }
      }
    }, 1000);
    this.interval = interval;
    setTimeout(() => {
      if (endCount === true) {
        if (eventOwner === userId) {
          this.elementRef.nativeElement.querySelector("#startEvent")
            .addEventListener('click', (e) => {
              this.startEvent();
          });
        } else if (checkInApproved !== 1) {
          this.elementRef.nativeElement.querySelector("#checkIn")
            .addEventListener('click', (e) => {
              this.checkIn();
          }); 
        }
      }
    }, 1000);
  }

  async checkIn() {
    const alert = await this.alertController.create({
      header: 'Check In',
      message: 'Are you sure you want confirm you`re ready?',
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Okay',
          handler: () => {
            const checkInSub = this.fs.collection('events-members', ref => ref.where('userId', '==', localStorage.getItem('userId')).where('meetingId', '==', this.eventId))
              .valueChanges()
              .subscribe((data) => {
                this.fs.collection('events-members').doc(data[0]['id']).update({
                  checkIn: 1,
                }).then(() => {
                  checkInSub.unsubscribe();
                  document.getElementById('countTime').innerHTML = '<ion-button color="success">Checked In</ion-button><br><small>Wait for start</small>';
                });
              });
          }
        }]
    });
    await alert.present();
  }
  
  async startEvent() {
    const alert = await this.alertController.create({
      header: 'Start Event',
      message: 'Are you sure you want start event?',
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Okay',
          handler: () => {
            this.fs.collection('events').doc(this.eventId).update({
              start: true,
            }).then(() => {
              console.log('event was started');
              this.renderBeers();
            });
          }
        }]
    });
    await alert.present();
  }

  async usersList() {
    const modal = await this.modalController.create({
      component: UsersListPage,
      componentProps: {
        'eventId': this.eventId,
      }
    });
    return await modal.present();
  }

  ionViewWillLeave() {
    if (this.subEvents) {
      this.subEvents.unsubscribe();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.subUsersJoined) {
      this.subUsersJoined.unsubscribe();
    }
    if (this.subUsersConfirmed) {
      this.subUsersConfirmed.unsubscribe();
    }
    if (this.subCountBeers) {
      this.subCountBeers.unsubscribe();
    }
  }

  renderBeers() {
    this.eventStarted = true;
    this.beers = this.fs.collection('beers', ref => ref.where('eventId', '==', this.eventId)).valueChanges();
    this.subCountBeers = this.beers.subscribe((data) => {
      this.countBeers = data.length;
    });
    this.showBeer = 0;
  }

  async blgInfo(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  onRate(rate) {
    this.rateTaste = rate;
  }
  
  onRateLook(rate) {
    this.rateLook = rate;
  }
  
  onRateCraft(rate) {
    this.rateCraft = rate;
  }

  onRatePower(rate) {
    this.ratePower = rate;
  }

  anotherBeer(beerId) {
    if (
      this.rateTaste != 0 &&
      this.rateLook != 0 &&
      this.rateCraft != 0 &&
      this.ratePower != 0
    ) {
      this.fs.collection('opinions').doc(beerId).set({
        userId: localStorage.getItem('userId'),
        eventId: this.eventId,
        beerId: beerId,
        rateTaste: this.rateTaste,
        rateLook: this.rateLook,
        rateCraft: this.rateCraft,
        ratePower: this.ratePower,
        timestamp:  firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        this.showBeer++;
        this.rateTaste = 0;
        this.rateLook = 0;
        this.rateCraft = 0;
        this.ratePower = 0;
      })
    } else {
      alert('Please fill all reviews');
    }
  }

  goToPage(page) {
    this.help.nav(page);
  }
  
  deactiveEvent() {
      this.fs.collection('events').doc(this.eventId).update({
        active: false
      }).then(() => {
        this.help.nav('meetings');
      }).catch((error) => {
    });
  }
}
