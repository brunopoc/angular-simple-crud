import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.API_ENDPOINT}categoria`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch categories', () => {
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
  });

  it('should create a category', () => {
    const newCategory: Category = { id: '3', name: 'New Category' };

    service.createCategory(newCategory).subscribe((category) => {
      expect(category).toEqual(newCategory);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCategory);
    req.flush(newCategory);
  });

  it('should update a category', () => {
    const updatedCategory: Category = { id: '1', name: 'Updated Category' };

    service.updateCategory('1', updatedCategory).subscribe((category) => {
      expect(category).toEqual(updatedCategory);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCategory);
    req.flush(updatedCategory);
  });

  it('should delete a category', () => {
    service.deleteCategory('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});