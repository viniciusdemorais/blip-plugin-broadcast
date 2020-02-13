import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Observable string sources
  private customSubject = new Subject<boolean>();

  // tslint:disable-next-line: member-ordering
  customObservable = this.customSubject.asObservable();

  showLoad() {
    this.customSubject.next(true);
  }

  hiddeLoad() {
    this.customSubject.next(false);
  }
}
