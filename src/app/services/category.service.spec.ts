import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.API_ENDPOINT}categoria`;
  let errorHandlerServiceSpy: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(() => {
    errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', [
      'handleError',
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CategoryService,
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy },
      ],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([]);

    expect(service).toBeTruthy();
  });
  it('should fetch categories and cache them', () => {
    const dummyCategories: Category[] = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];

    service.getCategories().subscribe((categories) => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);

    service.getCategories().subscribe((cachedCategories) => {
      expect(cachedCategories).toEqual(dummyCategories);
    });
  });

  it('should refresh categories and clear cache', () => {
    const dummyCategories: Category[] = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];

    const newDummyCategories: Category[] = [
      { id: '3', name: 'Category 3' },
      { id: '4', name: 'Category 4' },
    ];

    service.getCategories().subscribe();
    const req = httpMock.expectOne(apiUrl);
    req.flush(dummyCategories);

    service.refreshCategories();

    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(newDummyCategories);
    });

    const newReq = httpMock.expectOne(apiUrl);
    expect(newReq.request.method).toBe('GET');
    newReq.flush(newDummyCategories);
  });

  it('should create a category and update cache', () => {
    const newCategory: Category = { id: '3', name: 'New Category' };
    const dummyCategories: Category[] = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];
    const updatedCategories: Category[] = [...dummyCategories, newCategory];

    service.getCategories().subscribe();
    const req = httpMock.expectOne(apiUrl);
    req.flush(dummyCategories);

    service.createCategory(newCategory).subscribe((category) => {
      expect(category).toEqual(newCategory);
    });

    const postReq = httpMock.expectOne(apiUrl);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body).toEqual(newCategory);
    postReq.flush(newCategory);

    const getReq = httpMock.expectOne(apiUrl);
    expect(getReq.request.method).toBe('GET');
    getReq.flush(updatedCategories);

    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(updatedCategories);
    });
  });

  it('should delete a category and update cache', () => {
    const dummyCategories: Category[] = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];
    const updatedCategories: Category[] = [dummyCategories[1]];

    service.getCategories().subscribe();
    const req = httpMock.expectOne(apiUrl);
    req.flush(dummyCategories);

    service.deleteCategory('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const deleteReq = httpMock.expectOne(`${apiUrl}/1`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null, { status: 204, statusText: 'No Content' });

    const getReq = httpMock.expectOne(apiUrl);
    expect(getReq.request.method).toBe('GET');
    getReq.flush(updatedCategories);

    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(updatedCategories);
    });
  });
});
