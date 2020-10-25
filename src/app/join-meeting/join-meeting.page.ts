import { Component, OnInit } from '@angular/core';
import { HelpersService } from '../services/helpers.service';

@Component({
  selector: 'app-join-meeting',
  templateUrl: './join-meeting.page.html',
  styleUrls: ['./join-meeting.page.scss'],
})
export class JoinMeetingPage implements OnInit {

  code: number;
  status: string;

  constructor(
    public help: HelpersService
  ) { }

  ngOnInit() {
    this.status = '';
  }

  validFields() {
    if (
      this.code != null
    ) {
      return true;
    } else {
      return false;
    }
  }

  joinMeeting() {
    this.help.presentLoading();
    this.help.toastInfo('You joined to meeting!');
    this.help.dismissLoading();
    this.help.nav('hub');
  }
}
