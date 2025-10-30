import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ValidationRoutingModule } from './validation-routing.module';
import { ValidationComponent } from './validation.component';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationRoutingModule,
    ValidationComponent
]
})
export class ValidationModule { }
