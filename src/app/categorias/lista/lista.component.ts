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
import { RouterLink } from '@angular/router';
import { catchError, take, Subject, takeUntil, BehaviorSubject, shareReplay } from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LoadingService } from '@services/loading.service';

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
  ],
})
export class CategoriasListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();
  displayedColumns: string[] = ['name', 'action'];
  dataSource = new MatTableDataSource<Category>();
  isListEmpty: boolean = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private errorHandlerService: ErrorHandlerService,
    protected loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.onLoadLista();
  }

  onLoadLista(): void {
    this.loadingService.loadingOn();
    this.categoryService
      .getCategories()
      .pipe(
        shareReplay(1),
        takeUntil(this.destroy$),
      )
      .subscribe((categories) => {
        this.loadingService.loadingOff();
        this.categoriesSubject.next(categories);
        this.dataSource.data = categories;

        this.isListEmpty = this.categoriesSubject.value.length <= 0;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRemove(id: string) {
    this.loadingService.loadingOn();
    this.categoryService
      .deleteCategory(id)
      .pipe(
        take(1),
        catchError((error) => this.errorHandlerService.handleError(error))
      )
      .subscribe(() => {
        this.loadingService.loadingOff();
        this.categoriesSubject.next(this.categoriesSubject.value.filter(e => e.id !== id));
        this.updateDataSource();
        this.categoryService.refreshCategories();
        this.notificationService.open(
          'Categoria deletada com sucesso!',
          'SUCCESS'
        );
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private updateDataSource(): void {
    this.dataSource.data = this.categoriesSubject.value;
    this.dataSource.sort = this.sort;
  }
}
