import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { GastosPessoaisService } from './gastos-pessoais.service';
import { Lancamento } from '../models/lancamento.model';
import { environment } from '../../environments/environment';

describe('GastosPessoaisService', () => {
  let service: GastosPessoaisService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.API_ENDPOINT}lancamento`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GastosPessoaisService],
    });
    service = TestBed.inject(GastosPessoaisService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch lancamentos', () => {
    const dummyLancamentos: Lancamento[] = [
      {
        id: '1',
        idCategoria: 'cat1',
        description: 'Lancamento 1',
        date: '2023-01-01',
        value: 100,
      },
      {
        id: '2',
        idCategoria: 'cat2',
        description: 'Lancamento 2',
        date: '2023-01-02',
        value: 200,
      },
    ];

    service.getLancamentos().subscribe((lancamentos) => {
      expect(lancamentos.length).toBe(2);
      expect(lancamentos).toEqual(dummyLancamentos);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyLancamentos);
  });

  it('should create a lancamento', () => {
    const newLancamento: Lancamento = {
      id: '3',
      idCategoria: 'cat3',
      description: 'New Lancamento',
      date: '2023-01-03',
      value: 300,
    };

    service.createLancamento(newLancamento).subscribe((lancamento) => {
      expect(lancamento).toEqual(newLancamento);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newLancamento);
    req.flush(newLancamento);
  });

  it('should delete a lancamento', () => {
    service.deleteLancamento('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should fetch a lancamento by id', () => {
    const dummyLancamento: Lancamento = {
      id: '1',
      idCategoria: 'cat1',
      description: 'Lancamento 1',
      date: '2023-01-01',
      value: 100,
    };

    service.getLancamento('1').subscribe((lancamento) => {
      expect(lancamento).toEqual(dummyLancamento);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyLancamento);
  });
});
