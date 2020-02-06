import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Area } from '@app/models/Area';

@Injectable()
export class AreaService {
  constructor(private http: HttpClient) {}

  retrieveAreas(): Observable<any> {
    return this.http.request<any>('get', `Area`).pipe(map(resp => resp));
  }
}
