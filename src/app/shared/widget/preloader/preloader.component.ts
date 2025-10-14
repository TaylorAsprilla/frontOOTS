import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class PreloaderComponent implements OnInit {
  @Input() display: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
