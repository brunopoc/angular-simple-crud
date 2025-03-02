import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'gastos-pessoais',
    loadChildren: () =>
      import('./gastos-pessoais/gastos-pessoais.routes').then(
        (r) => r.GASTOS_PESSOAIS
      ),
  },
  {
    path: 'categorias',
    loadChildren: () =>
      import('./categorias/categorias.routes').then((r) => r.CATEGORIAS),
  },
];
