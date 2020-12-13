import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HelpersService } from '../../services/helpers.service';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
})
export class UsersListPage implements OnInit {

  @Input() eventId: string;
  userId: string;
  usersJoined: any;
  subUsersJoined: any;
  eventOwner: string;

  constructor(
    private fs: AngularFirestore,
    public help: HelpersService,
    public modalController: ModalController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    const subOwner = this.fs.collection('events', ref => ref.where('id', '==', this.eventId))
      .valueChanges()
      .subscribe((data) => {
        this.userId = localStorage.getItem('userId');
        this.eventOwner = data[0]['userId'];
        console.log(this.eventOwner);
        subOwner.unsubscribe();
      });
    this.usersJoined = this.fs.collection('events-members', ref => ref.where('meetingId', '==', this.eventId))
      .valueChanges();
    this.subUsersJoined = this.usersJoined.subscribe((data) => {

      });
  }

  async deleteUser(joinId) {
    const alert = await this.alertController.create({
      header: 'Delete joined user',
      message: 'Are you sure you want delete this joined user?',
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Okay',
          handler: () => {
            this.help.presentLoading();
            this.fs.collection('events-members').doc(joinId).delete().then(data => {
            this.help.dismissLoading();
            this.help.toastInfo('User was deleted');
            });
          }
        }]
    });
    await alert.present();
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

}
