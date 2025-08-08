import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { NgChartsModule } from 'ng2-charts';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Select2Module } from 'ng-select2-component';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ProjectsRoutingModule } from './projects-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    Select2Module,
    NgbDatepickerModule,
    NgxDropzoneModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    PageTitleModule,
    WidgetModule,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule { }
