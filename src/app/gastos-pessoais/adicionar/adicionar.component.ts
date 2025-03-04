import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { GastosPessoaisService } from '@services/gastos-pessoais.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { catchError, take, Subject, takeUntil, BehaviorSubject } from 'rxjs';
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
import { Category } from '@models/category.model';
import { CategoryService } from '@services/category.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-gastos-pessoais-adicionar',
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
    MatDatepickerModule,
    MatSelectModule,
    NgxMaskDirective,
  ],
  providers: [provideMomentDateAdapter(MY_DATE_FORMATS), provideNgxMask()],
})
export class GastosPessoaisAdicionarComponent implements OnInit, OnDestroy {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private readonly router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  protected isSubmitAvailable: boolean = false;

  gastosPessoaisForm: FormGroup;
  categories$ = this.categoriesSubject.asObservable();

  constructor(
    private categoryService: CategoryService,
    private gastosPessoaisService: GastosPessoaisService,
    private notificationService: NotificationService,
    protected loadingService: LoadingService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.gastosPessoaisForm = this.fb.group({
      idCategoria: ['', Validators.required],
      description: ['', Validators.required],
      date: [null, Validators.required],
      expenseAmount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.gastosPessoaisForm.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isSubmitAvailable = this.gastosPessoaisForm.valid;
      });

    this.onLoadLista();
  }

  onLoadLista(): void {
    this.loadingService.loadingOn();
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.categoriesSubject.next(categories);
        this.loadingService.loadingOff();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.loadingService.loadingOn();
    const dateValue = this.gastosPessoaisForm.get('date')?.value;
    const formattedDate = dateValue
      ? formatDate(dateValue, 'dd/MM/yyyy', 'en-US')
      : '';

    const rawValue = this.gastosPessoaisForm.get('expenseAmount')?.value;
    const numericValue = rawValue === 'string'? Number(rawValue.replace(/\./g, '').replace(',', '.')): rawValue;

    this.gastosPessoaisService
      .createLancamento({
        idCategoria: this.gastosPessoaisForm.get('idCategoria')?.value,
        description: this.gastosPessoaisForm.get('description')?.value,
        date: formattedDate,
        value: numericValue,
      })
      .pipe(
        take(1),
        catchError((error) => this.errorHandlerService.handleError(error))
      )
      .subscribe({
        next: () => {
          this.notificationService.open(
            'GastosPessoais adicionado com sucesso!',
            'SUCCESS'
          );
          this.router.navigate(['gastos-pessoais', 'lista']);
        },
        complete: () => this.loadingService.loadingOff(),
      });
  }
}
