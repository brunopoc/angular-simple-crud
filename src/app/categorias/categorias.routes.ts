import { Routes } from '@angular/router';
import { CategoriasListaComponent } from './lista/lista.component';
import { CategoriasAdicionarComponent } from './adicionar/adicionar.component';

export const CATEGORIAS: Routes = [
  { path: 'lista', component: CategoriasListaComponent },
  { path: 'adicionar', component: CategoriasAdicionarComponent },
];
