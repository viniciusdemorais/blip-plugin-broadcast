import { OnInit, OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { IframeService } from '@app/services/iframe.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  unsub = new Subject();
  loadingWelcome = false;
  constructor(private iframeService: IframeService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  toast() {
    this.iframeService.showToast({
      type: 'danger',
      message: 'Success loaded'
    });
  }
}
