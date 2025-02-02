import {Injectable} from 'angular2/core';
import {Http, URLSearchParams} from 'angular2/http';
import 'rxjs/add/operator/map';
import {User} from './user';
declare var Stomp: any;
declare var SockJS: any;

@Injectable()
export class Ad {
  baseUrl: string = "/api/ad";
  notificationHandlers = [];
  stompClient: any = null;

  constructor(private http: Http, private user: User) {
    this.connectWS();
  }

  getList(query: string) {
    var url = this.baseUrl;
    if (query) {
      url += "?query=" + query;
    }
    return this.http.get(url)
      .map((res) => res.json());
  }

  getMyAds() {
    return this.http.get(this.baseUrl + "/myads")
      .map((res) => res.json());
  }

  get(id: string) {
    return this.http.get(this.baseUrl + "/" + id)
      .map((res) => res.json());
  }

  getPublic(id: string, token: string) {
    return this.http.get(this.baseUrl + "/" + id + "/token/" + token)
      .map((res) => res.json());
  }

  create(text) {
    return this.http.post(this.baseUrl, JSON.stringify({ text: text }))
      .subscribe(
      response => {
        if (!this.user.hasRole('ADMIN')) {
          alert("Ad posted. An admin will review it")
        }
      },
      error => console.error("error creating ad", error)
      );
  }

  update(id: string, mods) {
    return this.http.put(this.baseUrl + "/" + id, JSON.stringify(mods));
  }

  accept(id: string) {
    return this.review(id, true);
  }

  reject(id: string) {
    return this.review(id, false);
  }

  review(id: string, approved: boolean) {
    return this.http.post(this.baseUrl + "/" + id + "/review", JSON.stringify({ approved: approved }))
  }

  publish(id: string) {
    return this.http.post(this.baseUrl + "/" + id + "/publish", JSON.stringify({}));
  }

  addNotificationHandler(cb: Function) {
    this.notificationHandlers.push(cb);
  }

  private connectWS() {
    if (this.stompClient) {
      return;
    }
    var socket = new SockJS('/notification');
    this.stompClient = Stomp.over(socket);
    var that = this;
    this.stompClient.connect({}, function(frame) {
      console.log('Connected to ad notification service.');
      that.stompClient.subscribe('/ad/accepted', function(ad) {
        that.notificationHandlers.forEach(function(handler) {
          handler(ad);
        })
      });
    });
  }
}
