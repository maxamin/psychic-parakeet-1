import {Injectable, provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {SeedApp} from './app/seed-app';
import {BaseRequestOptions, RequestOptions} from 'angular2/http'

@Injectable()
export class ExRequestOptions extends BaseRequestOptions  {
  constructor() {
    super();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('X-CSRF-TOKEN', this.getCookie('XSRF-TOKEN'));
  }

  getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2)
      return parts.pop().split(";").shift();
  }
}

bootstrap(SeedApp, [HTTP_PROVIDERS, ROUTER_PROVIDERS, provide(RequestOptions, {useClass: ExRequestOptions})])//, provide(LocationStrategy, {useClass: HashLocationStrategy})
  .catch(err => console.error(err));
