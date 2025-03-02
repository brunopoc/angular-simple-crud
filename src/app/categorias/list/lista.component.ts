import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categorias-lista',
  standalone: true,
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
  imports: [CommonModule, MatTableModule, MatSortModule, MatIconModule],
})
export class CategoriasListaComponent implements OnInit, AfterViewInit {
  categories: Category[];
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<Category>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private categoryService: CategoryService) {
    this.categories = [];
    this.dataSource = new MatTableDataSource(this.categories);
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      console.log(categories);
      this.categories = categories;

      this.dataSource.data = categories;
    });
  }

  onRemove(id: string) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.categories = this.categories.filter((e) => e.id !== id);
      this.dataSource.data = this.categories;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
