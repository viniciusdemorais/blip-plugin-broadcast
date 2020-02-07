import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { IndividualBroadComponent } from './individual-broad.component';

const routes: Routes = [{ path: '', component: IndividualBroadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class IndividualBroadRoutingModule {}
