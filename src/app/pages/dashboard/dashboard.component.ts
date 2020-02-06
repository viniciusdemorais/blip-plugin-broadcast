import { OnInit, OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { BlipService } from '@app/services/blip.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  unsub = new Subject();
  loadingDashboard = false;
  constructor(private blipService: BlipService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  toast() {
    this.blipService.showToast({
      type: 'danger',
      message: 'Success loaded'
    });
  }
}
