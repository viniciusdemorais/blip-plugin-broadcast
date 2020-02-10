import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BroadComponent } from './broad.component';

const routes: Routes = [{ path: '', component: BroadComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BroadRoutingModule {}
