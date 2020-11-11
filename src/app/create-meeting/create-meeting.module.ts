import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateMeetingPageRoutingModule } from './create-meeting-routing.module';

import { CreateMeetingPage } from './create-meeting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMeetingPageRoutingModule
  ],
  declarations: [CreateMeetingPage]
})
export class CreateMeetingPageModule {}
