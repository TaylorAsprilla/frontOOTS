import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-404-two',
  templateUrl: './error404two.component.html',
  styleUrls: ['./error404two.component.scss']
})
export class Error404twoComponent implements OnInit {

  currentYear!: number;

  constructor () { }

  ngOnInit(): void {
    this.currentYear = Date.now();
  }

}
