import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GastosPessoaisListaComponent } from './lista.component';
import { GastosPessoaisService } from '@services/gastos-pessoais.service';
import { CategoryService } from '@services/category.service';
import { NotificationService } from '@services/notification.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LoadingService } from '@services/loading.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { Lancamento } from '@models/lancamento.model';
import { ActivatedRoute } from '@angular/router';

describe('GastosPessoaisListaComponent', () => {
  let component: GastosPessoaisListaComponent;
  let fixture: ComponentFixture<GastosPessoaisListaComponent>;
  let gastosPessoaisServiceMock: jasmine.SpyObj<GastosPessoaisService>;
  let categoryServiceMock: jasmine.SpyObj<CategoryService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;
  let errorHandlerServiceMock: jasmine.SpyObj<ErrorHandlerService>;
  let loadingServiceMock: jasmine.SpyObj<LoadingService>;
  let loadingSubject: BehaviorSubject<boolean>;

  const activatedRouteMock = {
    snapshot: { paramMap: { get: () => null } },
    queryParams: of({}),
  };

  beforeEach(async () => {
    gastosPessoaisServiceMock = jasmine.createSpyObj('GastosPessoaisService', [
      'getLancamentos',
      'deleteLancamento',
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
        GastosPessoaisListaComponent,
        MatTableModule,
        MatSortModule,
        MatIconModule,
      ],
      providers: [
        { provide: GastosPessoaisService, useValue: gastosPessoaisServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GastosPessoaisListaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and display data in table', () => {
    const mockLancamentos: Lancamento[] = [
      {
        id: '1',
        description: 'Compra',
        value: 100,
        date: '2024-03-01',
        idCategoria: '1',
      },
      {
        id: '2',
        description: 'Transporte',
        value: 50,
        date: '2024-03-02',
        idCategoria: '2',
      },
    ];
    const mockCategories = [
      { id: '1', name: 'Alimentação' },
      { id: '2', name: 'Transporte' },
    ];

    gastosPessoaisServiceMock.getLancamentos.and.returnValue(
      of(mockLancamentos)
    );
    categoryServiceMock.getCategories.and.returnValue(of(mockCategories));

    fixture.detectChanges();

    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].categoriaNome).toBe('Alimentação');
  });

  it('should handle error and show empty state when API fails', () => {
    gastosPessoaisServiceMock.getLancamentos.and.returnValue(
      throwError(() => new Error('Erro ao carregar'))
    );
    errorHandlerServiceMock.handleError.and.returnValue(of());

    fixture.detectChanges();

    expect(component.isListEmpty).toBeTrue();
  });

  it('should remove an item and update the list', () => {
    const mockLancamentos: Lancamento[] = [
      {
        id: '1',
        description: 'Compra',
        value: 100,
        date: '2024-03-01',
        idCategoria: '1',
      },
      {
        id: '2',
        description: 'Transporte',
        value: 50,
        date: '2024-03-02',
        idCategoria: '2',
      },
    ];
    const mockCategories = [
      { id: '1', name: 'Alimentação' },
      { id: '2', name: 'Transporte' },
    ];

    gastosPessoaisServiceMock.getLancamentos.and.returnValue(
      of(mockLancamentos)
    );
    gastosPessoaisServiceMock.deleteLancamento.and.returnValue(of(void 0));
    categoryServiceMock.getCategories.and.returnValue(of(mockCategories));

    fixture.detectChanges();

    component.onRemove('1');

    fixture.detectChanges();

    expect(gastosPessoaisServiceMock.deleteLancamento).toHaveBeenCalledWith(
      '1'
    );
    expect(notificationServiceMock.open).toHaveBeenCalledWith(
      'Lançamento deletado com sucesso!',
      'SUCCESS'
    );
    expect(component.dataSource.data.length).toBe(1);
  });

  it('should render the add button with correct attributes', () => {
    gastosPessoaisServiceMock.getLancamentos.and.returnValue(of([]));

    fixture.detectChanges();

    const addButton = fixture.debugElement.query(
      By.css('[data-test-id="gastos-pessoais-adicionar"]')
    );

    expect(addButton.attributes['routerLink']).toBe(
      '/gastos-pessoais/adicionar'
    );
  });
});
