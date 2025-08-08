import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { AdvancedTableModule } from 'src/app/shared/advanced-table/advanced-table.module';
import { AdvanceRoutingModule } from './advance-routing.module';
import { AdvanceComponent } from './advance.component';



@NgModule({
  declarations: [
    AdvanceComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    AdvancedTableModule,
    AdvanceRoutingModule
  ]
})
export class AdvanceModule { }
