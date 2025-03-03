import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { GastosPessoaisAdicionarComponent } from './adicionar.component';
import { GastosPessoaisService } from '@services/gastos-pessoais.service';
import { NotificationService } from '@services/notification.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LoadingService } from '@services/loading.service';
import { CategoryService } from '@services/category.service';
import { Router } from '@angular/router';
import { EMPTY, of, throwError, BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Lancamento } from '@models/lancamento.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('GastosPessoaisAdicionarComponent', () => {
  let component: GastosPessoaisAdicionarComponent;
  let fixture: ComponentFixture<GastosPessoaisAdicionarComponent>;
  let gastosPessoaisServiceMock: jasmine.SpyObj<GastosPessoaisService>;
  let categoryServiceMock: jasmine.SpyObj<CategoryService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;
  let errorHandlerServiceMock: jasmine.SpyObj<ErrorHandlerService>;
  let loadingServiceMock: jasmine.SpyObj<LoadingService>;
  let routerMock: jasmine.SpyObj<Router>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    gastosPessoaisServiceMock = jasmine.createSpyObj('GastosPessoaisService', [
      'createLancamento',
    ]);
    categoryServiceMock = jasmine.createSpyObj('CategoryService', [
      'getCategories',
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
        GastosPessoaisAdicionarComponent,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatDatepickerModule,
      ],
      providers: [
        { provide: GastosPessoaisService, useValue: gastosPessoaisServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: Router, useValue: routerMock },
        provideNativeDateAdapter(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    categoryServiceMock.getCategories.and.returnValue(of([]));

    fixture = TestBed.createComponent(GastosPessoaisAdicionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', fakeAsync(() => {
    const mockCategories = [{ id: '1', name: 'Alimentação' }];
    categoryServiceMock.getCategories.and.returnValue(of(mockCategories));
    component.onLoadLista();
    fixture.detectChanges();
    tick();

    component.categories$.subscribe((categories) => {
      expect(categories).toEqual(mockCategories);
    });
  }));

  it('should enable submit button when form is valid', () => {
    const mockCategories = [{ id: '1', name: 'Alimentação' }];
    categoryServiceMock.getCategories.and.returnValue(of(mockCategories));
    fixture.detectChanges();

    component.gastosPessoaisForm.setValue({
      idCategoria: '1',
      description: 'Teste',
      date: new Date().toISOString(),
      value: 50,
    });
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('[data-test-id="gastos-pessoais-adicionar-submit-button"]')
    );
    expect(submitButton.nativeElement.disabled).toBe(false);
  });

  it('should call createLancamento on submit and navigate to list', fakeAsync(() => {
    const mockCategories = [{ id: '1', name: 'Alimentação' }];
    categoryServiceMock.getCategories.and.returnValue(of(mockCategories));
    component.gastosPessoaisForm.setValue({
      idCategoria: '1',
      description: 'Teste',
      date: new Date().toISOString(),
      value: 50,
    });
    fixture.detectChanges();

    gastosPessoaisServiceMock.createLancamento.and.returnValue(
      of({
        idCategoria: '1',
        description: 'Teste',
        date: new Date().toISOString(),
        value: 50,
      } as Lancamento)
    );

    const form = fixture.debugElement.query(
      By.css('[data-test-id="gastos-pessoais-adicionar-form"]')
    );
    form.triggerEventHandler('ngSubmit', {});
    tick();

    expect(gastosPessoaisServiceMock.createLancamento).toHaveBeenCalled();
    expect(notificationServiceMock.open).toHaveBeenCalledWith(
      'GastosPessoais adicionado com sucesso!',
      'SUCCESS'
    );
    expect(routerMock.navigate).toHaveBeenCalledWith([
      'gastos-pessoais',
      'lista',
    ]);
  }));

  it('should handle error on createLancamento', () => {
    component.gastosPessoaisForm.setValue({
      idCategoria: '1',
      description: 'Teste',
      date: new Date().toISOString(),
      value: 50,
    });
    fixture.detectChanges();

    gastosPessoaisServiceMock.createLancamento.and.returnValue(
      throwError(() => new Error('Create failed'))
    );
    errorHandlerServiceMock.handleError.and.returnValue(EMPTY);

    const form = fixture.debugElement.query(
      By.css('[data-test-id="gastos-pessoais-adicionar-form"]')
    );
    form.triggerEventHandler('ngSubmit', {});

    expect(errorHandlerServiceMock.handleError).toHaveBeenCalled();
  });

  it('should disable button while loading', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(
      By.css('[data-test-id="gastos-pessoais-adicionar-submit-button"]')
    );
    expect(submitButton.nativeElement.disabled).toBe(true);
  });
});
