import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { catchError, take, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorComponent } from '../../shared/components/snackbar/error/error.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../services/loading.service';
import { SuccessComponent } from '../../shared/components/snackbar/success/success.component';
import { Router } from '@angular/router';

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
  protected categoryName: string;
  private _snackBar = inject(MatSnackBar);
  private durationInSeconds = 5;
  private readonly router = inject(Router);

  constructor(
    private categoryService: CategoryService,
    protected loadingService: LoadingService
  ) {
    this.categoryName = '';
  }

  onAdd() {
    this.loadingService.loadingOn();
    this.categoryService
      .createCategory({ name: this.categoryName })
      .pipe(take(1), catchError(this.handleError.bind(this)))
      .subscribe(() => {
        this.openSnackBar('SUCCESS');
        this.loadingService.loadingOff();
        this.router.navigate(['categorias', 'lista']);
      });
  }

  openSnackBar(type: 'ERROR' | 'SUCCESS') {
    if (type == 'ERROR') {
      const snackBarRef = this._snackBar.openFromComponent(ErrorComponent, {
        duration: this.durationInSeconds * 1000,
        panelClass: ['notification-bg__error']
      });

      snackBarRef.instance.message = 'Ocorreu um erro na criação da categoria';
    }

    if (type == 'SUCCESS') {
      const snackBarRef = this._snackBar.openFromComponent(SuccessComponent, {
        duration: this.durationInSeconds * 1000,
        panelClass: ['notification-bg__success']
      });

      snackBarRef.instance.message = 'Categoria salva com sucesso!';
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

    this.loadingService.loadingOff();

    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  ngOnInit(): void {}
}
