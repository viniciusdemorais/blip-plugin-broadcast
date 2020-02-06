import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Colaborador } from '@app/models/Colaborador';

@Injectable()
export class ColaboradorService {
  constructor(private http: HttpClient) {}

  retrieveColaboradores(): Observable<any> {
    return this.http.request<any>('get', `Colaborador`).pipe(map(resp => resp));
  }

  retrieveColaboradoresConfirmaAgendamento(idAgendamento: number): Observable<any> {
    return this.http.request<any>('get', `Colaborador/ConfirmaAgendamento/${idAgendamento}`).pipe(map(resp => resp));
  }

  retrieveColaboradoresRh(): Observable<any> {
    return this.http.request<any>('get', `Colaborador/Rh`).pipe(map(resp => resp));
  }

  saveColaborador(data: Colaborador): Observable<any> {
    return this.http.request<any>('post', `Colaborador`, { body: data }).pipe(map(resp => resp));
  }

  deleteColaborador(id: number): Observable<any> {
    return this.http.request<any>('delete', `Colaborador/${id}`).pipe(map(resp => resp));
  }
}
