import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaddaModule } from 'angular2-ladda';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { LoadingButtonsRoutingModule } from './loading-buttons-routing.module';
import { LoadingButtonsComponent } from './loading-buttons.component';
import { ButtonWithProgressComponent } from './button-with-progress/button-with-progress.component';
import { SimpleButtonComponent } from './simple-button/simple-button.component';


@NgModule({
  declarations: [
    LoadingButtonsComponent,
    ButtonWithProgressComponent,
    SimpleButtonComponent,
  ],
  imports: [
    CommonModule,
    LaddaModule,
    PageTitleModule,
    LoadingButtonsRoutingModule
  ]
})
export class LoadingButtonsModule { }
