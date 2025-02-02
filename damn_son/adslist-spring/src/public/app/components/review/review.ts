import {Component, Input} from 'angular2/core';
import {Ad} from '../../services/ad';
import {Observable} from 'rxjs/Observable';
import {RouteParams, ROUTER_DIRECTIVES, Router} from 'angular2/router';

@Component({
  selector: 'review',
  templateUrl: 'app/components/review/review.html',
  providers: [],
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})

export class Review {
  selected;

  constructor(private router: Router, private ad: Ad, params: RouteParams) {
    ad.get(params.get("id")).subscribe(loaded => this.selected = loaded,
      error => console.error("error loading ad", error)
      )
  }

  accept() {
    this.ad.accept(this.selected.id).subscribe(
      ad => {
        this.router.navigate(['/Admin/List', {}]);
      },
      err => {
        alert("Unable to accept ad: " + JSON.stringify(err));
        this.router.navigate(['/Admin/List', {}]);
      });
  }

  reject() {
    this.ad.reject(this.selected.id).subscribe(
      ad => {
        this.router.navigate(['/Admin/List', {}]);
      },
      err => {
        alert("Unable to reject ad: " + JSON.stringify(err));
        this.router.navigate(['/Admin/List', {}]);
      });
  }
}
