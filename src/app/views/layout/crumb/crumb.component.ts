import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crumb',
  templateUrl: './crumb.component.html',
  styleUrls: ['./crumb.component.scss']
})
export class CrumbComponent implements OnInit {

  constructor (
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    console.log(this.route, '面包屑');
  }

}
