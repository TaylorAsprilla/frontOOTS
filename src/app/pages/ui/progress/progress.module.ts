import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ProgressRoutingModule } from './progress-routing.module';
import { ProgressComponent } from './progress.component';



@NgModule({
  declarations: [
    ProgressComponent
  ],
  imports: [
    CommonModule,
    NgbProgressbarModule,
    PageTitleModule,
    ProgressRoutingModule
  ]
})
export class ProgressModule { }
