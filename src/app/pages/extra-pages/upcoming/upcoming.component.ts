import { AfterViewInit, Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss']
})
export class UpcomingComponent implements OnInit, AfterViewInit {

  remainingTime: string[] = [];
  countDownDate = new Date("2023/02/13");
  tick = 1000;
  days!: string;
  hours!: string;
  minutes!: string;
  seconds!: string;

  constructor () {
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    document.body.classList.remove('authentication-bg-pattern');

  }

  /**
   * calculates remaining time
   */
  countDown(event: any): void {
    this.hours = event.hours;
    this.minutes = event.minutes;
    this.seconds = event.seconds;
    this.days = event.days;
  }


  /**
    * checks if count down completed
    */
  isCompeted(): boolean {
    if (new Date() > this.countDownDate) {
      return true
    }
    return false;
  }


}

