import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-500-two',
  templateUrl: './error500two.component.html',
  styleUrls: ['./error500two.component.scss']
})
export class Error500twoComponent implements OnInit {

  currentYear!: number;

  constructor () { }

  ngOnInit(): void {
    this.currentYear = Date.now();
  }

}
