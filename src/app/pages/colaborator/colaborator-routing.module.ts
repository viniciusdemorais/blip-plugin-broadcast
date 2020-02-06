import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { ColaboratorComponent } from './colaborator.component';

const routes: Routes = [{ path: '', component: ColaboratorComponent, data: { title: extract('Colaboradores') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ColaboratorRoutingModule {}
