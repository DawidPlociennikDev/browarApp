import { Component, OnInit } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { HelpersService } from '../services/helpers.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  status: string;
  loader: any;

  constructor(
    private facebook: Facebook,
    private clipboard: Clipboard,
    private fs: AngularFirestore,
    private af: AngularFireAuth,
    public help: HelpersService,
  ) {}

  ngOnInit() {
    if (
      localStorage.getItem('userId') != null &&
      localStorage.getItem('email') != null &&
      localStorage.getItem('firstName') != null &&
      localStorage.getItem('lastName') != null &&
      localStorage.getItem('avatar')
    ) {
      this.help.nav('hub');
    }
  }

  facebookLogin() {
    return this.facebook.login(['email'])
      .then( response => {
        alert('Facebook success: ' + JSON.stringify(response));
        this.status = response.authResponse.accessToken;
        this.clipboard.copy(this.status);
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
          .then( success => {
            alert('Firebase success: ' + JSON.stringify(success));
          });
      }).catch((error) => {
        alert( JSON.stringify(error));
      });
  }

  symulateLogin() {
    this.help.presentLoading();
    const token = 'EAALbWSYNW80BACR5nZChMDtxKvTET0kIFRujDCu4176PEAJlIgzzm7iQZCHelimmt95ZBwZBbT2kiZBvs3u0cx3P3M3yv61EGytKi78mnVnKBUn1hWRsV2ZBpZC5hXbwyQAA3C2urQWykBSzugsSAZB9Tj07fKrlB60cNCVZAPqKdnjisvTtNlNVokGwmPaZCssYf2ZAPg47E4u4dNR5nKYZBqLe9oET3XIV0OQZD';
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(token);
    this.af.auth.signInWithCredential(facebookCredential).then(success => {
      this.fs.collection('users').doc(success.user.uid).set({
        userId: success.user.uid,
        email: success.additionalUserInfo.profile['email'],
        firstName: success.additionalUserInfo.profile['first_name'],
        lastName: success.additionalUserInfo.profile['last_name'],
        avatar: success.additionalUserInfo.profile['picture'].data.url,
        timestamp:  firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        localStorage.setItem('userId', success.user.uid);
        localStorage.setItem('email', success.additionalUserInfo.profile['email']);
        localStorage.setItem('firstName', success.additionalUserInfo.profile['first_name']);
        localStorage.setItem('lastName', success.additionalUserInfo.profile['last_name']);
        localStorage.setItem('avatar', success.additionalUserInfo.profile['picture'].data.url);
        this.help.dismissLoading();
        this.help.nav('hub');
      });
    }).catch((error) => {
      console.log(error);
    });
  }

}
