import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ClickOutsideModule } from 'ng-click-outside';

import { VerticalLayoutComponent } from './vertical/layout/layout.component';
import { HorizontalLayoutComponent } from './horizontal/layout/layout.component';
import { DetachedLayoutComponent } from './detached/layout/layout.component';
import { TwoColumnMenuLayoutComponent } from './two-column-menu/layout/layout.component';
import { LeftSidebarComponent } from './shared/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './shared/right-sidebar/right-sidebar.component';
import { TopbarComponent } from './shared/topbar/topbar.component';
import { TopnavComponent } from './horizontal/topnav/topnav.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [
    VerticalLayoutComponent,
    HorizontalLayoutComponent,
    DetachedLayoutComponent,
    TwoColumnMenuLayoutComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    TopbarComponent,
    TopnavComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    SimplebarAngularModule,
    ClickOutsideModule,
  ],
  exports: [
    VerticalLayoutComponent,
    HorizontalLayoutComponent,
    DetachedLayoutComponent,
    TwoColumnMenuLayoutComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    TopbarComponent,
    TopnavComponent,
    FooterComponent,
  ],
})
export class LayoutModule {}
