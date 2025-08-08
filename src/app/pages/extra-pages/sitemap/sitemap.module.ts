import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { SitemapRoutingModule } from './sitemap-routing.module';
import { SitemapComponent } from './sitemap.component';


@NgModule({
  declarations: [
    SitemapComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    SitemapRoutingModule
  ]
})
export class SitemapModule { }
