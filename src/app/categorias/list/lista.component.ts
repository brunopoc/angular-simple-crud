import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, take, throwError } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-categorias-lista',
  standalone: true,
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
})
export class CategoriasListaComponent implements OnInit, AfterViewInit {
  categories: Category[];
  displayedColumns: string[] = ['name', 'action'];
  dataSource: MatTableDataSource<Category>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {
    this.categories = [];
    this.dataSource = new MatTableDataSource(this.categories);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }

    this.notificationService.open(
      'Ocorreu um erro na deleção da categoria',
      'ERROR'
    );

    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      console.log(categories);
      this.categories = categories;

      this.dataSource.data = categories;
    });
  }

  onRemove(id: string) {
    this.categoryService
      .deleteCategory(id)
      .pipe(take(1), catchError(this.handleError.bind(this)))
      .subscribe(() => {
        this.categories = this.categories.filter((e) => e.id !== id);
        this.dataSource.data = this.categories;
        this.notificationService.open(
          'Categoria deletada com sucesso!',
          'SUCCESS'
        );
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
