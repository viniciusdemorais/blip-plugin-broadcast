import { OnInit, OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { IframeService } from '@app/services/iframe.service';

@Component({
  selector: 'app-individual-broad',
  templateUrl: './individual-broad.component.html',
  styleUrls: ['./individual-broad.component.scss']
})
export class IndividualBroadComponent implements OnInit, OnDestroy {
  unsub = new Subject();
  loadingIndividualBroad = false;
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
