import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { HelpersService } from '../services/helpers.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  meetingId: string;
  name: string;
  date: string;
  hour: string;
  address: string;
  avatar: string;
  eventStartSeconds: number;

  subEvents: any;
  interval: any;

  constructor(
    private fs: AngularFirestore,
    public help: HelpersService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    this.meetingId = this.route.snapshot.paramMap.get('meetingId');
  }

  ngOnInit() {
    this.help.presentLoading();
    this.subEvents = this.fs.collection('events', ref => ref.where('id', '==', this.meetingId))
      .valueChanges()
      .subscribe((data) => {
        this.name = data[0]['name'];
        this.date = data[0]['date'];
        this.hour = data[0]['hour'];
        this.address = data[0]['address'];
        this.avatar = data[0]['avatar'];

        const transformDate = this.datePipe.transform(data[0]['date'], 'yyyy-MM-dd');
        const dateEvent = new Date(transformDate).getTime();
        let hoursEvent = this.datePipe.transform(data[0]['hour'], 'HH:mm');
        const a = hoursEvent.split(':');
        const seconds = (+a[0] - 1) * 60 * 60 + (+a[1]) * 60;
        hoursEvent = (seconds * 1000).toString();

        this.eventStartSeconds = Math.floor(dateEvent + parseInt(hoursEvent, 10));
        this.countDown();

        this.subEvents.unsubscribe();
        this.help.dismissLoading();
      });
  }

  countDown() {
    const countDownDate = this.eventStartSeconds;
    this.interval = setInterval(function() {
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
        clearInterval(this.interval);
        document.getElementById('countTime').innerHTML = '<ion-button>Start Event</ion-button>';
      }
    }, 1000);
  }

  ionViewWillLeave() {
    if (this.subEvents) {
      this.subEvents.unsubscribe();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
