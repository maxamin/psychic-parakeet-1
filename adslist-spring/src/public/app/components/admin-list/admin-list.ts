import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {AdList} from '../ad-list/ad-list';

@Component({
  selector: 'admin-list',
  templateUrl: 'app/components/admin-list/admin-list.html',
  providers: [],
  directives: [ROUTER_DIRECTIVES, AdList],
  pipes: []
})

export class AdminList {
  constructor(params:RouteParams) {
  }
}
