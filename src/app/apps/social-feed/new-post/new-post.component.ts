import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-social-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
  imports: [CommonModule, FormsModule, NgbNavModule],
  standalone: true,
})
export class NewPostComponent implements OnInit {
  active = 1;
  postText: string = '';

  constructor() {}

  ngOnInit(): void {}
}
