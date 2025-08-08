import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';


@NgModule({
  declarations: [
    DetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxDropzoneModule,
    NgbDropdownModule,
    PageTitleModule,
    DetailsRoutingModule
  ]
})
export class DetailsModule { }
