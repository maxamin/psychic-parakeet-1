import {Component} from 'angular2/core';
import {Router, RouteConfig, Route, ROUTER_DIRECTIVES} from 'angular2/router';

import {AdminList} from '../admin-list/admin-list';
import {Review} from '../review/review';
import {Ad} from '../../services/ad';

@Component({
  selector: 'admin',
  templateUrl: 'app/components/admin/admin.html',
  providers: [],
  directives: [ROUTER_DIRECTIVES, AdminList],
  pipes: []
})

@RouteConfig([
  new Route({ path: '/', component: AdminList, name: 'List' }),
  new Route({ path: '/review/:id', component: Review, name: 'Review' }),
])

export class Admin {

  constructor(private router: Router, private ad: Ad) { }

}
