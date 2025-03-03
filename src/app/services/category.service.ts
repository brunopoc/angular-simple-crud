import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, catchError, tap } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.API_ENDPOINT}categoria`;
  private categoriesCache$ = new ReplaySubject<Category[]>(1);

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.http
      .get<Category[]>(this.apiUrl)
      .pipe(
        catchError((error) => this.errorHandlerService.handleError(error)),
        tap((categories) => this.categoriesCache$.next(categories))
      )
      .subscribe();
  }

  getCategories(): Observable<Category[]> {
    return this.categoriesCache$.asObservable();
  }

  refreshCategories(): void {
    this.categoriesCache$ = new ReplaySubject<Category[]>(1);
    this.loadCategories();
  }

  createCategory(category: Category): Observable<Category> {
    return this.http
      .post<Category>(this.apiUrl, category)
      .pipe(tap(() => this.loadCategories()));
  }

  deleteCategory(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.loadCategories()));
  }
}
