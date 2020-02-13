import { OnInit, OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { BlipService } from '@app/services/blip.service';
import { LoadingService } from '@app/services/loading.service';
@Component({
  selector: 'app-broad',
  templateUrl: './broad.component.html',
  styleUrls: ['./broad.component.scss']
})
export class BroadComponent implements OnInit, OnDestroy {
  unsub = new Subject();
  showConfigurations = false;
  takeDomain = '@take.net';

  templates: any[];
  botId: any;
  accessKey: any;

  constructor(private blipService: BlipService, private loadingService: LoadingService) {}

  ngOnInit() {
    this.getTemplates();
    this.getApplications();
    this.getAccount();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  async getAccount() {
    this.loadingService.showLoad();
    await this.blipService
      .getAccount()
      .then(
        res => {
          const email: string = res.response.email;
          if (email.indexOf(this.takeDomain) !== -1) {
            this.showConfigurations = true;
          }
        },
        error => {
          console.log(error);
        }
      )
      .finally(() => {
        this.loadingService.hiddeLoad();
      });
  }

  async getApplications() {
    this.loadingService.showLoad();
    await this.blipService
      .getApplication()
      .then(
        res => {
          this.botId = res.response.shortName;
          this.accessKey = res.response.accessKey;
        },
        error => {
          console.log(error);
        }
      )
      .finally(() => {
        this.loadingService.hiddeLoad();
      });
  }

  async getTemplates() {
    this.loadingService.showLoad();
    await this.blipService
      .getTemplates()
      .then(
        res => {
          console.log(res);
          this.templates = res.response.data;
        },
        error => {
          console.log(error);
        }
      )
      .finally(() => {
        this.loadingService.hiddeLoad();
      });
  }
}
