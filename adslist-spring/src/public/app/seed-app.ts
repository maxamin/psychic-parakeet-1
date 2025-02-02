import {Component} from 'angular2/core';
import {Router, Route, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {Home} from './components/home/home';
import {About} from './components/about/about';
import {Edit} from './components/edit/edit';
import {MyAds} from './components/myads/myads';
import {AdList} from './components/ad-list/ad-list';
import {Admin} from './components/admin/admin';
import {Public} from './components/public/public';
import {Ad} from './services/ad';
import {User} from './services/user';

@Component({
  selector: 'seed-app',
  providers: [Ad, User],
  templateUrl: 'app/seed-app.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})

@RouteConfig([
  new Route({ path: '/home', component: Home, name: 'Home', useAsDefault: true}),
  new Route({ path: '/edit/:id/', component: Edit, name: 'Edit'}),
  new Route({ path: '/about', component: About, name: 'About'}),
  new Route({ path: '/myads', component: MyAds, name: 'MyAds'}),
  new Route({ path: '/admin/...', component: Admin, name: 'Admin'}),
  new Route({ path: '/public/:id/:token', component: Public, name: 'Public'})
])
export class SeedApp {

  constructor(private user: User) {}

}
