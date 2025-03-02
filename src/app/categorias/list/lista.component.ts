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
import { ErrorComponent } from '../../shared/components/snackbar/error/error.component';
import { SuccessComponent } from '../../shared/components/snackbar/success/success.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, take, throwError } from 'rxjs';

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
  private durationInSeconds = 5;
  private _snackBar = inject(MatSnackBar);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private categoryService: CategoryService) {
    this.categories = [];
    this.dataSource = new MatTableDataSource(this.categories);
  }

  openSnackBar(type: 'ERROR' | 'SUCCESS') {
    if (type == 'ERROR') {
      const snackBarRef = this._snackBar.openFromComponent(ErrorComponent, {
        duration: this.durationInSeconds * 1000,
        panelClass: ['notification-bg__error'],
      });

      snackBarRef.instance.message = 'Ocorreu um erro na deleção da categoria';
    }

    if (type == 'SUCCESS') {
      const snackBarRef = this._snackBar.openFromComponent(SuccessComponent, {
        duration: this.durationInSeconds * 1000,
        panelClass: ['notification-bg__success'],
      });

      snackBarRef.instance.message = 'Categoria deletada com sucesso!';
    }
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

    this.openSnackBar('ERROR');

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
        this.openSnackBar('SUCCESS');
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
