import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'gastos-pessoais-adicionar',
  imports: [MatInputModule, MatButtonModule, MatListModule, MatCardModule],
  templateUrl: './adicionar.component.html',
  styleUrl: './adicionar.component.scss',
})
export class GastosAdicionarComponent {}
