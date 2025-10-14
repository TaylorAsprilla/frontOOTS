import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience, ProfileProjectItem } from '../../shared/contacts.model';
import { EXPERIENCE, PROJECTS } from '../../shared/data';

@Component({
  selector: 'app-profile-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  experienceList: Experience[] = [];
  projects: ProfileProjectItem[] = [];

  constructor() {}

  ngOnInit(): void {
    this._fetchData();
  }

  /**
   * fetches data
   */
  _fetchData(): void {
    this.experienceList = EXPERIENCE;
    this.projects = PROJECTS;
  }
}
