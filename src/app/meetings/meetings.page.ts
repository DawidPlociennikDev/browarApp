import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HelpersService } from '../services/helpers.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.page.html',
  styleUrls: ['./meetings.page.scss'],
})
export class MeetingsPage implements OnInit {

  status: string;
  status2: string;
  events: any;
  subEvents: any;
  selected: number;

  constructor(
    private fs: AngularFirestore,
    public help: HelpersService,
    private clipboard: Clipboard,
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
      this.help.dismissLoading();
    });

    this.status2 = 'You don`t have joined events yet';
  }

  ionViewWillLeave() {
    if (this.subEvents) {
      this.subEvents.unsubscribe();
    }
  }

  copyCode(code) {
    this.help.toastInfo('Code was copied');
    this.clipboard.copy(code);
  }
}
