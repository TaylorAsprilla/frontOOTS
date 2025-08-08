import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { PlaceholdersRoutingModule } from './placeholders-routing.module';
import { PlaceholdersComponent } from './placeholders.component';


@NgModule({
  declarations: [
    PlaceholdersComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    PlaceholdersRoutingModule
  ]
})
export class PlaceholdersModule { }
