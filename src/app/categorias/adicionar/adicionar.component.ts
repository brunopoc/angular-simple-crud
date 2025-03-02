import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-categorias-adicionar',
  standalone: true,
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class CategoriasAdicionarComponent implements OnInit {
  categoryName: string;

  constructor(private categoryService: CategoryService) {
    this.categoryName = '';
  }

  onAdd() {
    this.categoryService
      .createCategory({ name: this.categoryName })
      .subscribe((data) => {
        console.log('Adicionado!', data);
      });
  }

  ngOnInit(): void {}
}
