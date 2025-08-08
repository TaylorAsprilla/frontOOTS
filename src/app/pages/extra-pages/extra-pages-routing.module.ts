import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'starter',
  loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule)
},
{
  path: 'serach-results',
  loadChildren: () => import('./search-result/search-result.module').then(m => m.SearchResultModule)
},
  { path: 'gallery', loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule) },
  { path: 'timeline', loadChildren: () => import('./timeline/timeline.module').then(m => m.TimelineModule) },
  { path: 'sitemap', loadChildren: () => import('./sitemap/sitemap.module').then(m => m.SitemapModule) },
  { path: 'invoice', loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule) },
  { path: 'faq', loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule) },
  { path: 'pricing', loadChildren: () => import('./pricing/pricing.module').then(m => m.PricingModule) },
  { path: 'error-404-alt', loadChildren: () => import('./error404-alt/error404-alt.module').then(m => m.Error404AltModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraPagesRoutingModule { }
