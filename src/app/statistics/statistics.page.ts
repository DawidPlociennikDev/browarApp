import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HelpersService } from '../services/helpers.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {

  beers:any;
  rateCraft = [];
  rateLook = [];
  ratePower = [];
  rateTaste = [];
  subBeers: any;
  subOpinions: any;

  constructor(
    private fs: AngularFirestore,
    public help: HelpersService
  ) { }

  ngOnInit() {
      this.beers = this.fs.collection('beers').valueChanges();
      this.subBeers = this.beers.subscribe((data) => {
        data.forEach(element => {
          this.subOpinions = this.fs.collection('opinions', ref => ref.where('beerId', '==', element['id'])).valueChanges().subscribe((opinions) => {
            if (opinions.length > 0) {
              let avgCraft = 0;
              let avgLook = 0;
              let avgPower = 0;
              let avgTaste = 0;
              opinions.forEach(opinion => {
                avgCraft += opinion['rateCraft'];
                avgLook += opinion['rateLook'];
                avgPower += opinion['ratePower'];
                avgTaste += opinion['rateTaste'];
              });
              this.rateCraft[element['id']] = avgCraft;
              this.rateLook[element['id']] = avgLook;
              this.ratePower[element['id']] = avgPower;
              this.rateTaste[element['id']] = avgTaste;
            } else {
              this.rateCraft[element['id']] = 0;
              this.rateLook[element['id']] = 0;
              this.ratePower[element['id']] = 0;
              this.rateTaste[element['id']] = 0;
            }
          });
        });
      });
  }

    ionViewWillLeave() {
    if (this.subBeers) {
      this.subBeers.unsubscribe();
    }
    if (this.subOpinions) {
      this.subOpinions.unsubscribe();
    }
  }


}
