import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileManagerRoutingModule } from './file-manager-routing.module';
import { FileManagerComponent } from './file-manager.component';

import { QuickAccessComponent } from './quick-access/quick-access.component';
import { RecentFilesComponent } from './recent-files/recent-files.component';
import { NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
    CommonModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    FileManagerRoutingModule,
    FileManagerComponent,
    QuickAccessComponent,
    RecentFilesComponent
]
})
export class FileManagerModule { }
