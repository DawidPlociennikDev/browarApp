import { Component, OnInit } from '@angular/core';
import { HelpersService } from '../services/helpers.service';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.page.html',
  styleUrls: ['./hub.page.scss'],
})
export class HubPage implements OnInit {
  avatar: string;
  firstName: string;
  lastName: string;
  constructor(
    public help: HelpersService
  ) { }

  ngOnInit() {
    this.avatar = localStorage.getItem('avatar');
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
  }

  goToPage(page) {
    this.help.nav(page);
  }

}
