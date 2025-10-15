import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-management-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="user-management-layout">
      <!-- Optional: Add a consistent header or navigation for user management -->
      <div class="user-management-header">
        <div class="container-fluid">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item">
                <a routerLink="/dashboard-1">Dashboard</a>
              </li>
              <li class="breadcrumb-item active">User Management</li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Router outlet for child components -->
      <div class="user-management-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .user-management-layout {
        min-height: 100vh;
      }

      .user-management-header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        padding: 1rem 0;
        margin-bottom: 1rem;
      }

      .user-management-content {
        padding: 0 1rem;
      }

      .breadcrumb {
        background-color: transparent;
        padding: 0;
      }
    `,
  ],
})
export class UserManagementLayoutComponent {}
