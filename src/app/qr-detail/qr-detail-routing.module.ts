import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrDetailPage } from './qr-detail.page';

const routes: Routes = [
  {
    path: '',
    component: QrDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrDetailPageRoutingModule {}
