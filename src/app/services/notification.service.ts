import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationIndividual } from '@app/models/NotificationIndividual';
import { NotificationCsv } from '@app/models/NotificationCsv';

@Injectable()
export class NotificationService {
  constructor(private http: HttpClient) {}

  sendIndividualNotification(data: NotificationIndividual, botId: string, access: string): Observable<any> {
    return this.http
      .request<any>('post', `Notification`, { headers: { identifier: botId, accessKey: access }, body: data })
      .pipe(map(resp => resp));
  }

  sendCsvNotification(data: NotificationCsv, botId: string, access: string): Observable<any> {
    const formData = new FormData();
    formData.append('formFile', data.formFile);
    return this.http
      .request<any>('post', `Broadcast/csv`, {
        headers: {
          identifier: botId,
          accessKey: access
        },
        params: {
          phoneColumn: data.phoneColumn,
          namespace: data.wabanamespace,
          template: data.template,
          flowId: data.flowId,
          stateId: data.stateId,
          masterState: data.masterState,
          senderEmail: data.senderEmail,
          languageCode: data.languageCode,
          scheduleTime: data.scheduleTime
        },
        body: formData
      })
      .pipe(map(resp => resp));
  }
}
