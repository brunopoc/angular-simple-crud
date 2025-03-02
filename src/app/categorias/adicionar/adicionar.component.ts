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
import { LoadingService } from '../../services/loading.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

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
export class CategoriasAdicionarComponent {
  protected categoryName: string;
  private readonly router = inject(Router);

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
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
        this.notificationService.open('Categoria adicionada com sucesso!', 'SUCCESS');
        this.loadingService.loadingOff();
        this.router.navigate(['categorias', 'lista']);
      });
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

    this.notificationService.open('Ocorreu um erro na criação da categoria', 'ERROR');

    this.loadingService.loadingOff();

    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
