import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cidade } from '@app/models/Cidade';

@Injectable()
export class CidadeService {
  constructor(private http: HttpClient) {}

  retrieveCidades(): Observable<any> {
    return this.http.request<any>('get', `Cidade`).pipe(map(resp => resp));
  }
}
