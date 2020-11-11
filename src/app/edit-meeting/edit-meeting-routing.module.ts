import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditMeetingPage } from './edit-meeting.page';

const routes: Routes = [
  {
    path: '',
    component: EditMeetingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMeetingPageRoutingModule {}
