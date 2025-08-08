import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-with-progress',
  templateUrl: './button-with-progress.component.html',
  styleUrls: ['./button-with-progress.component.scss']
})
export class ButtonWithProgressComponent implements OnInit {

  @Input() btnClasses: string = '';
  @Input() dataStyle?: string;
  // progress-variable for Ladda
  progress: boolean | number = false;

  constructor () { }

  ngOnInit(): void {
  }


  /**
   * starts button loading
   */
  startLoading() {
    this.progress = 0; // starts spinner

    setTimeout(() => {
      this.progress = 0.5; // sets progress bar to 50%

      setTimeout(() => {
        this.progress = 1; // sets progress bar to 100%

        setTimeout(() => {
          this.progress = false; // stops spinner
        }, 200);
      }, 500);
    }, 400);
  }

}
