import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationService } from '@app/services/configuration.service';
import { NotificationService } from '@app/services/notification.service';
import { NotificationIndividual } from '@app/models/NotificationIndividual';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core';
import { BucketVariables } from '@app/models/BucketVariables';
import { IframeService } from '@app/services/iframe.service';
import { LoadingService } from '@app/services/loading.service';

@Component({
  selector: 'app-broad-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})
export class IndividualComponent implements OnInit, OnDestroy {
  @Input() templates: any[];
  @Input() botId: any;
  @Input() accessKey: any;
  unsub = new Subject();

  showTemplate = false;

  phoneNumber: string;
  email: string;
  defaultConfig: string;

  template: any;
  templateDescription: any;
  templateVariables: any[] = [];
  bucketTemplate: BucketVariables;
  defaultBucketTemplate: BucketVariables;

  constructor(
    private loadingService: LoadingService,
    private iframeService: IframeService,
    private configurationService: ConfigurationService,
    private notificationService: NotificationService
  ) {
    this.defaultConfig = 'default-config'
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  selectedTemplate(event: any) {
    this.templateVariables = [];
    this.template = this.templates.find(t => t.id == event.value);
    this.templateDescription = this.template.components.find((td: any) => td.type == 'BODY').text;
    const variables = this.templateDescription.match(/{{[0-9]*}}/gm) || [];
    variables.forEach((item: any) => {
      if (this.templateVariables.indexOf(item) == -1) {
        this.templateVariables.push(item);
      }
    });
    this.showTemplate = true;
  }

  variableId(text: any): string {
    return 'var' + text.replace(/{*}*/g, '');
  }

  variableValues(variableArray: any[]) {
    const variableValues: any = {};
    variableArray.forEach(element => {
      variableValues[this.variableId(element)] = (document.getElementById(
        this.variableId(element)
      ) as HTMLInputElement).value;
    });
    return variableValues;
  }

  async sendNotification() {
    this.loadingService.showLoad();

    if (this.template) {
      await this.getConfigurations(this.template.name);
    }
    await this.getDefaultConfigurations();

    const notificationObj: NotificationIndividual = {
      telephone: this.phoneNumber ? this.phoneNumber.replace(/[^\d]+/g, "") : null,
      template: this.template ? this.template.name : null,
      language_code: this.template ? this.template.language : null,
      master_state: this.defaultBucketTemplate.masterState,
      flow_id: this.defaultBucketTemplate.flowId,
      namespace: this.defaultBucketTemplate.namespace,
      state_id: this.bucketTemplate ? this.bucketTemplate.stateId : null,
      params: this.variableValues(this.templateVariables),
      sender_email: this.email,
      trackOrigin: true
    };
    if (this.validationFields(notificationObj)){
      this.notificationService
        .sendIndividualNotification(notificationObj, this.botId, this.accessKey)
        .pipe(
          untilDestroyed(this),
          finalize(() => {
            this.loadingService.hiddeLoad();
          })
        )
        .subscribe(
          res => {
            this.iframeService.showToast({
              type: 'success',
              message: 'Notificação enviada com sucesso!'
            });
          },
          error => {
            this.iframeService.showToast({
              type: 'danger',
              message: 'Falha ao enviar notificação!'
            });
          }
        );
    } else {
      this.loadingService.hiddeLoad();
    }
  }

  async getConfigurations(variable: any) {
    await this.configurationService.getBucket(variable).then(
      res => {
        this.bucketTemplate = res;
      },
      error => {
        this.bucketTemplate = {};
      }
    );
  }

  async getDefaultConfigurations() {
    await this.configurationService.getBucket(this.defaultConfig).then(
      res => {
        this.defaultBucketTemplate = res;
      },
      error => {
        this.defaultBucketTemplate = {};
      }
    );
  }

  validationFields(variable: NotificationIndividual): boolean {
    if (!variable.telephone) {
      this.iframeService.showToast(
        {
          type: 'danger',
          message: 'Você precisa definir o número de telefone!'
        }
      );
      return false;
    } 
    if (!variable.namespace) {
      this.iframeService.showToast(
        {
          type: 'danger',
          message: 'Você precisa configurar o namespace para fazer os disparos!'
        }
      );
      return false;
    } 

    return true;
  }
}
