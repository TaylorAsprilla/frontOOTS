import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SitemapRoutingModule } from './sitemap-routing.module';
import { SitemapComponent } from './sitemap.component';


@NgModule({
    imports: [
    CommonModule,
    SitemapRoutingModule,
    SitemapComponent
]
})
export class SitemapModule { }
