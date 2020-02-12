import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationService } from '@app/services/configuration.service';
import { IframeService } from '@app/services/iframe.service';

@Component({
  selector: 'app-broad-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  @Input() templates: any[];
  @Output() loadingStatus = new EventEmitter<boolean>();

  unsub = new Subject();

  masterState?: string;
  flowId?: string;
  stateId?: string;
  namespace?: string;

  template: any;
  templateDescription: any;
  templateVariables: any[] = [];

  constructor(private iframeService: IframeService, private configurationService: ConfigurationService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  async selectedTemplateBucket(event: any) {
    this.templateVariables = [];
    this.template = this.templates.find(t => t.id == event.value);
    this.templateDescription = this.template.components.find((td: any) => td.type == 'BODY').text;
    await this.getConfigurations(this.template.name);
  }

  variableId(text: any): string {
    return 'var' + text.replace(/{*}*/g, '');
  }

  async saveConfigurations() {
    this.loadingStatus.emit(true);
    const resources = {
      masterState: this.masterState,
      flowId: this.flowId,
      stateId: this.stateId,
      namespace: this.namespace
    };
    await this.configurationService
      .storeBucket(this.template.name, resources)
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
        this.loadingStatus.emit(false);
      });
  }

  async getConfigurations(variable: any) {
    this.loadingStatus.emit(true);
    const bucket = await this.configurationService
      .getBucket(variable)
      .then(
        res => {
          this.masterState = res.masterState ? res.masterState : null;
          this.flowId = res.flowId ? res.flowId : null;
          this.stateId = res.stateId ? res.stateId : null;
          this.namespace = res.namespace ? res.namespace : null;
        },
        error => {
          this.masterState = null;
          this.flowId = null;
          this.stateId = null;
          this.namespace = null;
        }
      )
      .finally(() => {
        this.loadingStatus.emit(false);
      });
    return bucket;
  }
}
