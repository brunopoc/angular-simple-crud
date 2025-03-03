import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lancamento } from '@models/lancamento.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GastosPessoaisService {
  private apiUrl = `${environment.API_ENDPOINT}lancamento`;

  constructor(private http: HttpClient) {}

  getLancamentos(): Observable<Lancamento[]> {
    return this.http.get<Lancamento[]>(this.apiUrl);
  }

  createLancamento(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.post<Lancamento>(this.apiUrl, lancamento);
  }

  deleteLancamento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getLancamento(id: string): Observable<Lancamento> {
    return this.http.get<Lancamento>(`${this.apiUrl}/${id}`);
  }
}
