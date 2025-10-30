import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';


@NgModule({
    imports: [
    CommonModule,
    MaintenanceRoutingModule,
    MaintenanceComponent
]
})
export class MaintenanceModule { }
