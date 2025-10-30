import { Routes } from '@angular/router';

const routes: Routes = [
  { path: 'buttons', loadComponent: () => import('./buttons/buttons.component').then((c) => c.ButtonsComponent) },
  { path: 'cards', loadComponent: () => import('./cards/cards.component').then((c) => c.CardsComponent) },
  { path: 'avatars', loadComponent: () => import('./avatars/avatars.component').then((c) => c.AvatarsComponent) },
  { path: 'portlets', loadChildren: () => import('./portlets/portlets.module').then((m) => m.PortletsModule) },
  {
    path: 'tabs-accordions',
    loadChildren: () => import('./tabs-accordions/tabs-accordions.module').then((m) => m.TabsAccordionsModule),
  },
  { path: 'modals', loadChildren: () => import('./modals/modals.module').then((m) => m.ModalsModule) },
  { path: 'progress', loadChildren: () => import('./progress/progress.module').then((m) => m.ProgressModule) },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then((m) => m.NotificationsModule),
  },
  { path: 'spinners', loadChildren: () => import('./spinners/spinners.module').then((m) => m.SpinnersModule) },
  { path: 'images', loadChildren: () => import('./images/images.module').then((m) => m.ImagesModule) },
  { path: 'carousel', loadComponent: () => import('./carousel/carousel.component').then((c) => c.CarouselComponent) },
  {
    path: 'listgroups',
    loadComponent: () => import('./listgroups/listgroups.component').then((c) => c.ListgroupsComponent),
  },
  {
    path: 'embedvideo',
    loadComponent: () => import('./embedvideo/embedvideo.component').then((c) => c.EmbedvideoComponent),
  },
  {
    path: 'dropdowns',
    loadComponent: () => import('./dropdowns/dropdowns.component').then((c) => c.DropdownsComponent),
  },
  { path: 'ribbons', loadChildren: () => import('./ribbons/ribbons.module').then((m) => m.RibbonsModule) },
  {
    path: 'tooltips-popovers',
    loadChildren: () => import('./tooltips-popovers/tooltips-popovers.module').then((m) => m.TooltipsPopoversModule),
  },
  { path: 'general', loadComponent: () => import('./general/general.component').then((c) => c.GeneralComponent) },
  {
    path: 'typography',
    loadComponent: () => import('./typography/typography.component').then((c) => c.TypographyComponent),
  },
  { path: 'grid', loadComponent: () => import('./grid/grid.component').then((c) => c.GridComponent) },
  {
    path: 'placeholders',
    loadComponent: () => import('./placeholders/placeholders.component').then((c) => c.PlaceholdersComponent),
  },
];

export default routes;
