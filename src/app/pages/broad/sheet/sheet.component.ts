import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationService } from '@app/services/notification.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core';
import { NotificationCsv } from '@app/models/NotificationCsv';
import { ConfigurationService } from '@app/services/configuration.service';
import { BucketVariables } from '@app/models/BucketVariables';
import { IframeService } from '@app/services/iframe.service';
import { LoadingService } from '@app/services/loading.service';

@Component({
  selector: 'app-broad-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss']
})
export class SheetComponent implements OnInit, OnDestroy {
  @Input() templates: any[];
  @Input() botId: any;
  @Input() accessKey: any;
  unsub = new Subject();

  showTemplate = false;

  email: string;
  phoneColumn: string;
  defaultConfig: string;

  bucketTemplate: BucketVariables;
  defaultBucketTemplate: BucketVariables;
  template: any;
  csvFile: File;
  templateDescription: any;
  templateVariables: any[] = [];

  constructor(
    private loadingService: LoadingService,
    private iframeService: IframeService,
    private configurationService: ConfigurationService,
    private notificationService: NotificationService
  ) {
    this.defaultConfig = 'default-config';
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

  fileInput(event: any) {
    this.csvFile = event.target.files[0];
  }

  async sendCsvNotification() {
    this.loadingService.showLoad();

    if (this.template) {
      await this.getConfigurations(this.template.name);
    }
    await this.getDefaultConfigurations();

    const notificationObj: NotificationCsv = {
      phoneColumn: this.phoneColumn,
      senderEmail: this.email,
      template: this.template ? this.template.name : null,
      languageCode: this.template ? this.template.language : null,
      wabanamespace: this.defaultBucketTemplate.namespace,
      masterState: this.defaultBucketTemplate.masterState,
      flowId: this.defaultBucketTemplate.flowId,
      stateId: this.bucketTemplate ? this.bucketTemplate.stateId : null,
      formFile: this.csvFile,
      scheduleTime: '0'
    };
    if (this.validationFields(notificationObj)) {
      this.notificationService
        .sendCsvNotification(notificationObj, this.botId, this.accessKey)
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

  validationFields(variable: NotificationCsv): boolean {
    if (!variable.formFile) {
      this.iframeService.showToast({
        type: 'danger',
        message: 'Você precisa definir a planilha para que seja realizado o envio!'
      });
      return false;
    }
    if (!variable.phoneColumn) {
      this.iframeService.showToast({
        type: 'danger',
        message: 'Você precisa definir o nome da coluna onde se encontra o número de telefone!'
      });
      return false;
    }
    if (!variable.wabanamespace) {
      this.iframeService.showToast({
        type: 'danger',
        message: 'Você precisa configurar o namespace para fazer os disparos!'
      });
      return false;
    }

    return true;
  }
}
