import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '@models/category.model';
import { CategoryService } from '@services/category.service';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, take, Subject, takeUntil } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { ErrorHandlerService } from '@services/error-handler.service';

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
export class CategoriasListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  categories: Category[];
  displayedColumns: string[] = ['name', 'action'];
  dataSource: MatTableDataSource<Category>;
  private destroy$ = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.categories = [];
    this.dataSource = new MatTableDataSource(this.categories);
  }

  ngOnInit(): void {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.updateDataSource(categories);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRemove(id: string) {
    this.categoryService
      .deleteCategory(id)
      .pipe(
        take(1),
        catchError((error) => this.errorHandlerService.handleError(error))
      )
      .subscribe(() => {
        this.categories = this.categories.filter((e) => e.id !== id);
        this.updateDataSource(this.categories);
        this.notificationService.open(
          'Categoria deletada com sucesso!',
          'SUCCESS'
        );
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private updateDataSource(categories: Category[]): void {
    this.categories = categories;
    this.dataSource.data = categories;
  }
}
