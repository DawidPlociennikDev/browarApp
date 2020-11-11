import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMeetingPageRoutingModule } from './edit-meeting-routing.module';

import { EditMeetingPage } from './edit-meeting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditMeetingPageRoutingModule
  ],
  declarations: [EditMeetingPage]
})
export class EditMeetingPageModule {}
