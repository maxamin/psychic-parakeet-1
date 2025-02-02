import {Injectable} from 'angular2/core';
import {Http, URLSearchParams, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class User {
  baseUrl: string = "/api/user";
  private loggedIn: boolean = false;
  current: any = {};

  constructor(private http: Http) {
    this.getCurrent().subscribe(
      user => {
        this.current = user;
        this.loggedIn = true;
      },
      err => {
        console.warn("Not logged in: " + JSON.stringify(err));
        this.current = {};
        this.loggedIn = false;
      });
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getCurrent() {
    return this.http.get(this.baseUrl + "/current")
      .map((res) => res.json());
  }

  get(id: string) {
    return this.http.get(this.baseUrl + "/" + id)
      .map((res) => res.json());
  }

  hasRole(role) {
    let authorities = this.current.authorities;
    if (authorities) {
      return authorities.find(descriptor => descriptor.authority === "ROLE_" + role);
    }
    return false;
  }
}
