import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h4>Case Detail Component</h4>
              <p>This component is under development.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CaseDetailComponent {}
