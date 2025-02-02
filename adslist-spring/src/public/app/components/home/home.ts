import {Component} from 'angular2/core';
import {Router, RouteConfig, Route, ROUTER_DIRECTIVES} from 'angular2/router';

import {AdList} from '../ad-list/ad-list';
import {Ad} from '../../services/ad';

@Component({
  selector: 'home',
  templateUrl: 'app/components/home/home.html',
  styleUrls: ['app/components/home/home.css'],
  providers: [],
  directives: [ROUTER_DIRECTIVES, AdList],
  pipes: []
})

export class Home {

  constructor(private router:Router, private ad: Ad) {}

  postAd(text) {
    this.ad.create(text);
    return false;
  }
}
