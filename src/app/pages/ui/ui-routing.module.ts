import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'buttons', loadChildren: () => import('./buttons/buttons.module').then(m => m.ButtonsModule) },
  { path: 'cards', loadChildren: () => import('./cards/cards.module').then(m => m.CardsModule) },
  { path: 'avatars', loadChildren: () => import('./avatars/avatars.module').then(m => m.AvatarsModule) },
  { path: 'portlets', loadChildren: () => import('./portlets/portlets.module').then(m => m.PortletsModule) },
  { path: 'tabs-accordions', loadChildren: () => import('./tabs-accordions/tabs-accordions.module').then(m => m.TabsAccordionsModule) },
  { path: 'modals', loadChildren: () => import('./modals/modals.module').then(m => m.ModalsModule) },
  { path: 'progress', loadChildren: () => import('./progress/progress.module').then(m => m.ProgressModule) },
  { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule) },
  { path: 'spinners', loadChildren: () => import('./spinners/spinners.module').then(m => m.SpinnersModule) },
  { path: 'images', loadChildren: () => import('./images/images.module').then(m => m.ImagesModule) },
  { path: 'carousel', loadChildren: () => import('./carousel/carousel.module').then(m => m.CarouselModule) },
  { path: 'listgroups', loadChildren: () => import('./listgroups/listgroups.module').then(m => m.ListgroupsModule) },
  { path: 'embedvideo', loadChildren: () => import('./embedvideo/embedvideo.module').then(m => m.EmbedvideoModule) },
  { path: 'dropdowns', loadChildren: () => import('./dropdowns/dropdowns.module').then(m => m.DropdownsModule) },
  { path: 'ribbons', loadChildren: () => import('./ribbons/ribbons.module').then(m => m.RibbonsModule) },
  { path: 'tooltips-popovers', loadChildren: () => import('./tooltips-popovers/tooltips-popovers.module').then(m => m.TooltipsPopoversModule) },
  { path: 'general', loadChildren: () => import('./general/general.module').then(m => m.GeneralModule) },
  { path: 'typography', loadChildren: () => import('./typography/typography.module').then(m => m.TypographyModule) },
  { path: 'grid', loadChildren: () => import('./grid/grid.module').then(m => m.GridModule) },
  { path: 'placeholders', loadChildren: () => import('./placeholders/placeholders.module').then(m => m.PlaceholdersModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiRoutingModule { }
