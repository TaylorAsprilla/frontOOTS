import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetachedModule } from './detached/detached.module';
import { HorizontalModule } from './horizontal/horizontal.module';
import { LayoutContainerComponent } from './layout-container.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { SharedModule } from './shared/shared.module';
import { TwoColumnMenuModule } from './two-column-menu/two-column-menu.module';
import { VerticalModule } from './vertical/vertical.module';



@NgModule({
  declarations: [
    LayoutContainerComponent,
    PublicLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    VerticalModule,
    HorizontalModule,
    DetachedModule,
    TwoColumnMenuModule
  ],
  exports: [LayoutContainerComponent, PublicLayoutComponent]
})
export class LayoutModule { }
