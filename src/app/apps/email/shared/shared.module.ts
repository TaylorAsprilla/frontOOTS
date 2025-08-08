import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    LeftSidebarComponent,
    TopbarComponent
  ],
  imports: [
    CommonModule,
    NgbDropdownModule
  ],
  exports: [
    LeftSidebarComponent,
    TopbarComponent
  ]
})
export class SharedModule { }
