import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-case-discussion-family-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './case-discussion-family-table.component.html',
  styleUrls: ['./case-discussion-family-table.component.scss'],
})
export class CaseDiscussionFamilyTableComponent {
  @Input({ required: true }) familyMembers!: FormArray<FormGroup>;
  @Input() readOnly = false;
  @Input() submitted = false;
  @Output() addMember = new EventEmitter<void>();
  @Output() removeMember = new EventEmitter<number>();

  trackByIndex(index: number): number {
    return index;
  }

  hasRowError(index: number, controlName: string): boolean {
    const control = this.familyMembers.at(index).get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }
}
