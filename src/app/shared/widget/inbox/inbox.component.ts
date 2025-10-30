import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { Message } from './inbox.model';

@Component({
  selector: 'app-widget-inbox',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, SimplebarAngularModule],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  @Input() messages: Message[] = [];
  @Input() height: number = 410;

  constructor() {}

  ngOnInit(): void {}
}
