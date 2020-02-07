import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [{ path: '', component: WelcomeComponent, data: { title: extract('Welcome') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class WelcomeRoutingModule {}
