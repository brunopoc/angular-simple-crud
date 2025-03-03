import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { throwError } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage =
      'Ocorreu um erro inesperado. Tente novamente mais tarde.';

    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
      errorMessage = `Erro ${error.status}: ${
        error.error?.message || 'Erro desconhecido'
      }`;
    }

    this.notificationService.open(errorMessage, 'ERROR');
    this.loadingService.loadingOff();

    return throwError(() => error);
  }
}
