import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from './error-handler.service';
import { NotificationService } from './notification.service';
import { LoadingService } from './loading.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'open',
    ]);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['loadingOff']);

    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle HttpErrorResponse with status 0', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Test Error',
      status: 0,
      statusText: 'Unknown Error',
    });

    service.handleError(errorResponse).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
        expect(notificationServiceSpy.open).toHaveBeenCalledWith(
          'Ocorreu um erro inesperado. Tente novamente mais tarde.',
          'ERROR'
        );
        expect(loadingServiceSpy.loadingOff).toHaveBeenCalled();
      },
    });
  });

  it('should handle HttpErrorResponse with status other than 0', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Custom Error Message' },
      status: 404,
      statusText: 'Not Found',
    });

    service.handleError(errorResponse).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
        expect(notificationServiceSpy.open).toHaveBeenCalledWith(
          'Erro 404: Custom Error Message',
          'ERROR'
        );
        expect(loadingServiceSpy.loadingOff).toHaveBeenCalled();
      },
    });
  });

  it('should handle HttpErrorResponse with status other than 0 and no error message', () => {
    const errorResponse = new HttpErrorResponse({
      error: {},
      status: 500,
      statusText: 'Internal Server Error',
    });

    service.handleError(errorResponse).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
        expect(notificationServiceSpy.open).toHaveBeenCalledWith(
          'Erro 500: Erro desconhecido',
          'ERROR'
        );
        expect(loadingServiceSpy.loadingOff).toHaveBeenCalled();
      },
    });
  });
});
