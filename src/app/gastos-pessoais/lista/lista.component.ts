import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lancamento } from '@models/lancamento.model';
import { GastosPessoaisService } from '@services/gastos-pessoais.service';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  catchError,
  take,
  Subject,
  takeUntil,
  BehaviorSubject,
  shareReplay,
} from 'rxjs';
import { NotificationService } from '@services/notification.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { LoadingService } from '@services/loading.service';
import { Category } from '@models/category.model';
import { CategoryService } from '@services/category.service';

interface LancamentoExibicao extends Lancamento {
  categoriaNome: string;
}

@Component({
  selector: 'app-gastos-pessoais-lista',
  standalone: true,
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
})
export class GastosPessoaisListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private gastosPessoaisSubject = new BehaviorSubject<LancamentoExibicao[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  gastosPessoais$ = this.gastosPessoaisSubject.asObservable();
  displayedColumns: string[] = [
    'description',
    'value',
    'date',
    'categoriaNome',
    'action',
  ];
  dataSource = new MatTableDataSource<LancamentoExibicao>();
  isListEmpty: boolean = false;
  private destroy$ = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private gastosPessoaisService: GastosPessoaisService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private errorHandlerService: ErrorHandlerService,
    protected loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.onLoadLista();
  }

  onLoadLista(): void {
    this.loadingService.loadingOn();
    this.gastosPessoaisService
      .getLancamentos()
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          this.isListEmpty = true;
          return this.errorHandlerService.handleError(error);
        })
      )
      .subscribe((gastosPessoais) => {
        this.onLoadCategoriasLista(gastosPessoais);
      });
  }

  onLoadCategoriasLista(gastosPessoais: Lancamento[]): void {
    this.loadingService.loadingOn();
    this.categoryService
      .getCategories()
      .pipe(shareReplay(1), takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.loadingService.loadingOff();
        this.categoriesSubject.next(categories);
        this.isListEmpty = this.categoriesSubject.value.length <= 0;

        const lancamentosExibicao: LancamentoExibicao[] = gastosPessoais.map(
          (lancamento) => {
            const categoria = categories.find(
              (cat) => cat.id === lancamento.idCategoria
            );
            return {
              ...lancamento,
              categoriaNome: categoria
                ? categoria.name
                : 'Categoria não encontrada',
            };
          }
        );

        this.dataSource.data = lancamentosExibicao;
        this.gastosPessoaisSubject.next(lancamentosExibicao);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRemove(id: string) {
    this.loadingService.loadingOn();
    this.gastosPessoaisService
      .deleteLancamento(id)
      .pipe(
        take(1),
        catchError((error) => this.errorHandlerService.handleError(error))
      )
      .subscribe(() => {
        this.loadingService.loadingOff();
        this.gastosPessoaisSubject.next(
          this.gastosPessoaisSubject.value.filter((e) => e.id !== id)
        );
        this.updateDataSource();
        this.notificationService.open(
          'Lançamento deletado com sucesso!',
          'SUCCESS'
        );
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private updateDataSource(): void {
    this.dataSource.data = this.gastosPessoaisSubject.value;
    this.dataSource.sort = this.sort;
  }
}
