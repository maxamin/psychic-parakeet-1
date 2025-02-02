import {Component, Input, OnInit} from 'angular2/core';
import {Ad} from '../../services/ad';
import {User} from '../../services/user';
import {Observable} from 'rxjs/Observable';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'ad-list',
  templateUrl: 'app/components/ad-list/ad-list.html',
  styleUrls: ['app/components/ad-list/ad-list.css'],
  providers: [],
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})

export class AdList {
  @Input() search: string
  ads: Observable<any>

  constructor(private ad: Ad, private user: User, params:RouteParams) {
    setTimeout(this.update.bind(this), 200);
    ad.addNotificationHandler(this.update.bind(this));
  }

  update() {
    this.ads = this.search === "myads" ? this.ad.getMyAds() : this.ad.getList(this.search);
  }

  publish(id: string) {
    this.ad.publish(id).subscribe(
      ad => {
        this.update();
      },
      err => {
        alert("Unable to publish ad: " + JSON.stringify(err));
      });
  }
}
