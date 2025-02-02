import {Component, Input} from 'angular2/core';
import {Ad} from '../../services/ad';
import {User} from '../../services/user';
import {Observable} from 'rxjs/Observable';
import {RouteParams, ROUTER_DIRECTIVES, Router} from 'angular2/router';

@Component({
  selector: 'review',
  templateUrl: 'app/components/edit/edit.html',
  providers: [Ad],
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})

export class Edit {
  selected = {text: "", id: "0"};

  constructor(private router: Router, private ad: Ad, private user: User, params: RouteParams) {
    ad.get(params.get("id")).subscribe(loaded => this.selected = loaded,
      error => console.error("error loading ad", error)
      )
  }

  save() {
    this.ad.update(this.selected.id, {text: this.selected.text}).subscribe(
      ad => {
        if (!this.user.hasRole('ADMIN')) {
          alert("Ad updated. An admin will review it again");
        }
        this.router.navigate(['/MyAds', {}]);
      },
      err => {
        console.error("error updating ad", err);
        this.router.navigate(['/MyAds', {}]);
      });
  }

}
