import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriasListaComponent } from './lista.component';
import { CategoryService } from '@services/category.service';
import { NotificationService } from '@services/notification.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LoadingService } from '@services/loading.service';
import { EMPTY, of, throwError, BehaviorSubject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('CategoriasListaComponent', () => {
  let component: CategoriasListaComponent;
  let fixture: ComponentFixture<CategoriasListaComponent>;
  let categoryServiceMock: jasmine.SpyObj<CategoryService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;
  let errorHandlerServiceMock: jasmine.SpyObj<ErrorHandlerService>;
  let loadingServiceMock: jasmine.SpyObj<LoadingService>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    categoryServiceMock = jasmine.createSpyObj('CategoryService', [
      'getCategories',
      'deleteCategory',
    ]);
    notificationServiceMock = jasmine.createSpyObj('NotificationService', [
      'open',
    ]);
    errorHandlerServiceMock = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError',
    ]);
    const activatedRouteMock = {
      snapshot: { paramMap: { get: () => null } },
      queryParams: of({}),
    };

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
        CategoriasListaComponent,
        MatTableModule,
        MatSortModule,
        MatIconModule,
      ],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasListaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display table when data is loaded', () => {
    const mockCategories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];
    categoryServiceMock.getCategories.and.returnValue(of(mockCategories));

    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('[data-test-id="categoria-tabela"]'));
    expect(table).toBeTruthy();
    expect(component['categoriesSubject'].value).toEqual(mockCategories);
  });

  it('should show error message when loadListFailed is true', () => {
    categoryServiceMock.getCategories.and.returnValue(
      throwError(() => new Error('Load failed'))
    );
    errorHandlerServiceMock.handleError.and.returnValue(EMPTY);

    fixture.detectChanges();

    const errorMsg = fixture.debugElement.query(By.css('[data-test-id="categoria-erro"]'));
    expect(errorMsg.nativeElement.textContent).toContain(
      'Ocorreu um erro ao tentar carregar a lista'
    );
  });

  it('should handle category removal and update UI', () => {
    const mockCategories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];

    categoryServiceMock.getCategories.and.returnValue(of(mockCategories));
    categoryServiceMock.deleteCategory.and.returnValue(of(void 0));

    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(
      By.css('[data-test-id="categoria-remover"]')
    );
    deleteButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(categoryServiceMock.deleteCategory).toHaveBeenCalledWith('1');
    expect(notificationServiceMock.open).toHaveBeenCalledWith(
      'Categoria deletada com sucesso!',
      'SUCCESS'
    );

    const rows = fixture.debugElement.queryAll(By.css('mat-row'));
    expect(rows.length).toBe(1);
  });

  it('should render the add button with correct attributes', () => {
    categoryServiceMock.getCategories.and.returnValue(of([]));

    fixture.detectChanges();
    const addButton = fixture.debugElement.query(By.css('[data-test-id="categoria-adicionar"]'));
    expect(addButton.attributes['routerLink']).toBe('/categorias/adicionar');
});
});
