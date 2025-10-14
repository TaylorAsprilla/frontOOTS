import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  //profile form
  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    bio: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    companyName: [''],
    website: [''],
    facebook: [''],
    twitter: [''],
    instagram: [''],
    linkedin: [''],
    skype: [''],
    github: [''],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
