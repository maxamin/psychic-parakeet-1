import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {AdList} from '../ad-list/ad-list';

@Component({
  selector: 'myads',
  templateUrl: 'app/components/myads/myads.html',
  providers: [],
  directives: [ROUTER_DIRECTIVES, AdList],
  pipes: []
})

export class MyAds {
  constructor(params:RouteParams) {
  }
}
