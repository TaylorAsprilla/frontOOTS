import { NgModule } from '@angular/core';
import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads.component';

@NgModule({
  imports: [LeadsRoutingModule, LeadsComponent],
})
export class LeadsModule {}
