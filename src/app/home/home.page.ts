import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import * as firebase from 'firebase';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { firebaseConfig } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  status: string;
  constructor(
    private facebook: Facebook,
    private clipboard: Clipboard
  ) {}

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
    firebase.initializeApp(firebaseConfig);
    const token = '### YOUR TOKEN TO SYMULATE ###';
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(token);
    firebase.auth().signInWithCredential(facebookCredential).then(success => {
      console.log('Firebase success: ', success);
      console.log('email', success.additionalUserInfo.profile['email']);
      console.log('first name', success.additionalUserInfo.profile['first_name']);
      console.log('last name', success.additionalUserInfo.profile['last_name']);
      console.log('avatar name', success.additionalUserInfo.profile['picture'].data.url);
    }).catch((error) => {
      console.log(error);
    });
  }
}
