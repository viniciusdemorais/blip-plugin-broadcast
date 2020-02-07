import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from './shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: '',
      loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)
    }
  ])
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
