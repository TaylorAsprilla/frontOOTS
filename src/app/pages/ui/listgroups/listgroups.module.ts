import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListgroupsRoutingModule } from './listgroups-routing.module';
import { ListgroupsComponent } from './listgroups.component';


@NgModule({
    imports: [
    CommonModule,
    ListgroupsRoutingModule,
    ListgroupsComponent
]
})
export class ListgroupsModule { }
