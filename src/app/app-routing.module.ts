import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'hub',
    loadChildren: () => import('./hub/hub.module').then( m => m.HubPageModule)
  },
  {
    path: 'create-meeting',
    loadChildren: () => import('./create-meeting/create-meeting.module').then( m => m.CreateMeetingPageModule)
  },
  {
    path: 'meetings',
    loadChildren: () => import('./meetings/meetings.module').then( m => m.MeetingsPageModule)
  },
  {
    path: 'join-meeting',
    loadChildren: () => import('./join-meeting/join-meeting.module').then( m => m.JoinMeetingPageModule)
  },
  {
    path: 'edit-meeting/:meetingId',
    loadChildren: () => import('./edit-meeting/edit-meeting.module').then( m => m.EditMeetingPageModule)
  },
  {
    path: 'event/:meetingId',
    loadChildren: () => import('./event/event.module').then( m => m.EventPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
