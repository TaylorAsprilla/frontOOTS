import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileManagerRoutingModule } from './file-manager-routing.module';
import { FileManagerComponent } from './file-manager.component';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { QuickAccessComponent } from './quick-access/quick-access.component';
import { RecentFilesComponent } from './recent-files/recent-files.component';
import { NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    FileManagerComponent,
    QuickAccessComponent,
    RecentFilesComponent
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    PageTitleModule,
    FileManagerRoutingModule
  ]
})
export class FileManagerModule { }
