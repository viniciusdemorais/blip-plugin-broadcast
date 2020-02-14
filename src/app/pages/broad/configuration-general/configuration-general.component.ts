import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationGeneralService } from '@app/services/configuration-general.service';
import { IframeService } from '@app/services/iframe.service';
import { LoadingService } from '@app/services/loading.service';

@Component({
  selector: 'app-broad-configuration-general',
  templateUrl: './configuration-general.component.html',
  styleUrls: ['./configuration-general.component.scss']
})
export class ConfigurationGeneralComponent implements OnInit, OnDestroy {
  unsub = new Subject();

  masterState?: string;
  flowId?: string;
  namespace?: string;
  templateName: string;

  constructor(
    private iframeService: IframeService,
    private configurationGeneralService: ConfigurationGeneralService,
    private loadingService: LoadingService
  ) {
    this.templateName = 'default-config';
  }

  ngOnInit() {
    this.getConfigurations();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  async saveConfigurations() {
    this.loadingService.showLoad();

    const resources = {
      masterState: this.masterState,
      flowId: this.flowId,
      namespace: this.namespace
    };
    await this.configurationGeneralService
      .storeBucket(this.templateName, resources)
      .then(
        res => {
          this.iframeService.showToast({
            type: 'success',
            message: 'Dados armazenados com sucesso!'
          });
        },
        error => {
          this.iframeService.showToast({
            type: 'danger',
            message: 'Falha ao armazenar os dados!'
          });
        }
      )
      .finally(() => {
        this.loadingService.hiddeLoad();
      });
  }

  async getConfigurations() {
    this.loadingService.showLoad();
    const bucket = await this.configurationGeneralService
      .getBucket(this.templateName)
      .then(
        res => {
          this.masterState = res.masterState ? res.masterState : null;
          this.flowId = res.flowId ? res.flowId : null;
          this.namespace = res.namespace ? res.namespace : null;
        },
        error => {
          this.masterState = null;
          this.flowId = null;
          this.namespace = null;
        }
      )
      .finally(() => {
        this.loadingService.hiddeLoad();
      });
    return bucket;
  }
}
