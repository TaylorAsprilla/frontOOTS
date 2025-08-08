import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {

  active = 1;
  postText: string = '';

  constructor () { }

  ngOnInit(): void {
  }

}
