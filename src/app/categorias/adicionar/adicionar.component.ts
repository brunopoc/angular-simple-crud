import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '@services/category.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { catchError, take, Subject, takeUntil } from 'rxjs';
import { LoadingService } from '@services/loading.service';
import { Router } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorHandlerService } from '@services/error-handler.service';

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
    ReactiveFormsModule,
  ],
})
export class CategoriasAdicionarComponent implements OnInit, OnDestroy {
  protected categoryForm: FormGroup;
  private readonly router = inject(Router);
  private fb = inject(FormBuilder);
  protected isSubmitAvailable: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    protected loadingService: LoadingService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryForm
      .get('name')
      ?.statusChanges.pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isSubmitAvailable = status === 'VALID';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.loadingService.loadingOn();
    this.categoryService
      .createCategory({ name: this.categoryForm.get('name')?.value })
      .pipe(
        take(1),
        catchError((error) => this.errorHandlerService.handleError(error))
      )
      .subscribe({
        next: () => {
          this.notificationService.open(
            'Categoria adicionada com sucesso!',
            'SUCCESS'
          );
          this.router.navigate(['categorias', 'lista']);
        },
        complete: () => this.loadingService.loadingOff(),
      });
  }
}
