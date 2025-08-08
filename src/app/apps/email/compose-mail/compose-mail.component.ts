import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-email-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.scss']
})
export class ComposeMailComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  mailTo: string = '';
  mailSubject: string = '';
  mailBody: string = '';

  constructor () {
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Email', path: '/' }, { label: 'Email Compose', path: '/', active: true }];
    this.mailBody = ` <h3><span class="ql-size-large">Hello World!</span></h3>
                      <p><br></p>
                      <h3>This is an simple editable area.</h3>
                      <p><br></p>
                      <ul>
                      <li>
                      Select a text to reveal the toolbar.
                      </li>
                      <li>
                      Edit rich document on-the-fly, so elastic!
                      </li>
                      </ul>
                      <p><br></p>
                      <p>
                      End of simple area
                      </p>`

  }


}
