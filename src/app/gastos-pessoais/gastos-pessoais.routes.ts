import { Routes } from '@angular/router';
import { GastosPessoaisListaComponent } from './lista/lista.component';
import { GastosPessoaisAdicionarComponent } from './adicionar/adicionar.component';

export const GASTOS_PESSOAIS: Routes = [
  { path: 'lista', component: GastosPessoaisListaComponent },
  { path: 'adicionar', component: GastosPessoaisAdicionarComponent },
];
