import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from './shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: '',
      loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
      path: 'colaboradores',
      loadChildren: () => import('./pages/colaborator/colaborator.module').then(m => m.ColaboratorModule)
    }
  ])
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
