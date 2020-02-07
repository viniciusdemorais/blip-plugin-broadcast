import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationIndividual } from '@app/models/NotificationIndividual';

@Injectable()
export class NotificationService {
  constructor(private http: HttpClient) {}

  sendIndividualNotification(data: NotificationIndividual, botId: string, access: string): Observable<any> {
    return this.http
      .request<any>('post', `Notification`, { headers: { identifier: botId, accessKey: access }, body: data })
      .pipe(map(resp => resp));
  }
}
