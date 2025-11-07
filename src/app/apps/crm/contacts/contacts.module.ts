import { NgModule } from '@angular/core';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';

@NgModule({
  imports: [ContactsRoutingModule, ContactsComponent],
})
export class ContactsModule {}
