import { OnInit, OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { BlipService } from '@app/services/blip.service';
@Component({
  selector: 'app-broad',
  templateUrl: './broad.component.html',
  styleUrls: ['./broad.component.scss']
})
export class BroadComponent implements OnInit, OnDestroy {
  unsub = new Subject();

  loading = false;
  showConfigurations = false;
  takeDomain = '@take.net';

  templates: any[];
  botId: any;
  accessKey: any;

  constructor(private blipService: BlipService) {}

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
    this.loading = true;
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
        this.loading = false;
      });
  }

  async getApplications() {
    this.loading = true;
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
        this.loading = false;
      });
  }

  async getTemplates() {
    this.loading = true;
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
        this.loading = false;
      });
  }

  changeLoading(event: boolean) {
    debugger;
    this.loading = event;
  }
}
