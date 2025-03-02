import { Routes } from '@angular/router';
import { GastosPessoaisListaComponent } from './lista/lista.component';
import { GastosAdicionarComponent } from './adicionar/adicionar.component';

export const GASTOS_PESSOAIS: Routes = [
  { path: 'lista', component: GastosPessoaisListaComponent },
  { path: 'adicionar', component: GastosAdicionarComponent },
];
