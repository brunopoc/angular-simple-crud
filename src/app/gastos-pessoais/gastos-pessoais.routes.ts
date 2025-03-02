import { Routes } from '@angular/router';

import { AdicionarComponent } from './adicionar/adicionar.component';
import { ListaComponent } from './lista/lista.component';


export const GASTOS_PESSOIS: Routes = [
  { path: 'lista', component: ListaComponent },
  { path: 'adicionar', component: AdicionarComponent }
]