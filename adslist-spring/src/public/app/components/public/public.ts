import {Component, Input} from 'angular2/core';
import {RouteParams, Router, Route, ROUTER_DIRECTIVES} from 'angular2/router';
import {Ad} from '../../services/ad';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'review',
  templateUrl: 'app/components/public/public.html',
  providers: [],
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})

export class Public {
  selected;

  constructor(private router: Router, private ad: Ad, params: RouteParams) {
    var token = params.get("token");
    var id = params.get("id");
    ad.getPublic(id, token).subscribe(loaded => this.selected = loaded,
      error => {
        this.selected = {text: "Unable to load ad. Invalid token: " + token}
        console.error("error loading ad", error)
      }
    )
  }
}
