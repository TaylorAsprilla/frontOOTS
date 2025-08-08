import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent, WillCloseEvent, WillOpenEvent } from '@sweetalert2/ngx-sweetalert2';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-extended-ui-sweet-alert',
  templateUrl: './sweet-alert.component.html',
  styleUrls: ['./sweet-alert.component.scss']
})
export class SweetAlertComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  email: string = '';

  @ViewChild('ajaxRequest') ajaxRequest!: SwalComponent;

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extended UI', path: '/' }, { label: 'Sweet Alerts', path: '/', active: true }];
  }

  /**
   * executes before confirmation
   */
  preConfirm(email: string): any {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'taken@example.com') {
          reject('This email is already taken.')
        } else {
          resolve('')
        }
      }, 2000)
    })
  }

  /**
   * handle confirm action of alert
   */
  handleConfirm(email: string): void {
    this.ajaxRequest.fire();
  }


}
