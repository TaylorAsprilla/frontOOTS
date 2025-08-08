import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';



@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    ContactsRoutingModule,
    ContactsComponent
]
})
export class ContactsModule { }
