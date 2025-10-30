import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './details.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    NgxDropzoneModule,
    NgbDropdownModule,
    DetailsRoutingModule,
    DetailsComponent
]
})
export class DetailsModule { }
