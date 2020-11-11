import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinMeetingPageRoutingModule } from './join-meeting-routing.module';

import { JoinMeetingPage } from './join-meeting.page';
import {NgxMaskIonicModule} from 'ngx-mask-ionic'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinMeetingPageRoutingModule,
    NgxMaskIonicModule
  ],
  declarations: [JoinMeetingPage]
})
export class JoinMeetingPageModule {}
