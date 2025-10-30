import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-social-featured-video',
  templateUrl: './featured-video.component.html',
  styleUrls: ['./featured-video.component.scss'],
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  standalone: true,
})
export class FeaturedVideoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
