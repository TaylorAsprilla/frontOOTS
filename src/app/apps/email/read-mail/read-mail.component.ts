import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-email-read-mail',
  templateUrl: './read-mail.component.html',
  styleUrls: ['./read-mail.component.scss']
})
export class ReadMailComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Email', path: '/' }, { label: 'Email Read', path: '/', active: true }];
  }


}
