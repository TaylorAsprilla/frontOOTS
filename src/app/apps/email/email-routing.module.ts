import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'compose', loadChildren: () => import('./compose-mail/compose-mail.module').then(m => m.ComposeMailModule) },
  { path: 'inbox', loadChildren: () => import('./inbox/inbox.module').then(m => m.InboxModule) },
  { path: 'details', loadChildren: () => import('./read-mail/read-mail.module').then(m => m.ReadMailModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRoutingModule { }
