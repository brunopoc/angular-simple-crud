import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriasAdicionarComponent } from './adicionar.component';
import { CategoryService } from '@services/category.service';
import { NotificationService } from '@services/notification.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LoadingService } from '@services/loading.service';
import { Router } from '@angular/router';
import { EMPTY, of, throwError, BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CategoriasAdicionarComponent', () => {
  let component: CategoriasAdicionarComponent;
  let fixture: ComponentFixture<CategoriasAdicionarComponent>;
  let categoryServiceMock: jasmine.SpyObj<CategoryService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;
  let errorHandlerServiceMock: jasmine.SpyObj<ErrorHandlerService>;
  let loadingServiceMock: jasmine.SpyObj<LoadingService>;
  let routerMock: jasmine.SpyObj<Router>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    categoryServiceMock = jasmine.createSpyObj('CategoryService', [
      'createCategory',
    ]);
    notificationServiceMock = jasmine.createSpyObj('NotificationService', [
      'open',
    ]);
    errorHandlerServiceMock = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    loadingSubject = new BehaviorSubject<boolean>(false);
    loadingServiceMock = jasmine.createSpyObj('LoadingService', [
      'loadingOn',
      'loadingOff',
    ]);
    Object.defineProperty(loadingServiceMock, 'loading$', {
      get: () => loadingSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [
        CategoriasAdicionarComponent,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasAdicionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    const input = fixture.debugElement.query(
      By.css('[data-test-id="categoria-adicionar-nome-input"]')
    );
    input.nativeElement.value = 'Test Category';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('[data-test-id="categoria-adicionar-submit-button"]')
    );
    expect(submitButton.nativeElement.disabled).toBe(false);
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = fixture.debugElement.query(
      By.css('[data-test-id="categoria-adicionar-submit-button"]')
    );
    expect(submitButton.nativeElement.disabled).toBe(true);
  });

  it('should call createCategory on submit and navigate to list', () => {
    const input = fixture.debugElement.query(
      By.css('[data-test-id="categoria-adicionar-nome-input"]')
    );
    input.nativeElement.value = 'Test Category';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Corrige o mock para retornar um Observable<Category>
    categoryServiceMock.createCategory.and.returnValue(
      of({ id: '1', name: 'Test Category' })
    );

    const form = fixture.debugElement.query(
      By.css('[data-test-id="categoria-adicionar-form"]')
    );
    form.nativeElement.dispatchEvent(new Event('submit'));

    expect(categoryServiceMock.createCategory).toHaveBeenCalledWith({
      name: 'Test Category',
    });
    expect(notificationServiceMock.open).toHaveBeenCalledWith(
      'Categoria adicionada com sucesso!',
      'SUCCESS'
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['categorias', 'lista']);
  });

  it('should handle error on createCategory', () => {
    const input = fixture.debugElement.query(
      By.css('[data-test-id="categoria-adicionar-nome-input"]')
    );
    input.nativeElement.value = 'Test Category';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    categoryServiceMock.createCategory.and.returnValue(
      throwError(() => new Error('Create failed'))
    );
    errorHandlerServiceMock.handleError.and.returnValue(EMPTY);

    const form = fixture.debugElement.query(
      By.css('[data-test-id="categoria-adicionar-form"]')
    );
    form.nativeElement.dispatchEvent(new Event('submit'));

    expect(errorHandlerServiceMock.handleError).toHaveBeenCalled();
  });

  it('should disable button while loading', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(
      By.css('[data-test-id="categoria-adicionar-submit-button"]')
    );
    expect(submitButton.nativeElement.disabled).toBe(true);
  });
});
