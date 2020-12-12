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
  {
    path: 'add-products/:eventId',
    loadChildren: () => import('./add-products/add-products.module').then( m => m.AddProductsPageModule)
  },
  {
    path: 'add-product-modal',
    loadChildren: () => import('./modal/add-product-modal/add-product-modal.module').then( m => m.AddProductModalPageModule)
  },
  {
    path: 'edit-product-modal/:beerId',
    loadChildren: () => import('./modal/edit-product-modal/edit-product-modal.module').then( m => m.EditProductModalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
