import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { ProgressRoutingModule } from './progress-routing.module';
import { ProgressComponent } from './progress.component';



@NgModule({
    imports: [
    CommonModule,
    NgbProgressbarModule,
    ProgressRoutingModule,
    ProgressComponent
]
})
export class ProgressModule { }
