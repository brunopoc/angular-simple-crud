import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { loadCategories } from '../../../store/category.actions';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category',
  standalone: true,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  imports: [CommonModule, MatTableModule, MatSortModule, MatIconModule],
})
export class CategoryComponent implements OnInit, AfterViewInit {
  categories: Category[];
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<Category>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private categoryService: CategoryService, private store: Store) {
    this.categories = [];
    this.dataSource = new MatTableDataSource(this.categories);
  }

  ngOnInit(): void {
    this.store.dispatch(loadCategories());
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    this.categories = [
      { id: '1', name: 'Alimentação' },
      { id: '2', name: 'Transporte' },
      { id: '3', name: 'Lazer' },
    ];

    this.dataSource = new MatTableDataSource(this.categories);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
