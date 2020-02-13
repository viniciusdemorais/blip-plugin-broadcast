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

  bucketTemplate: BucketVariables;
  template: any;
  csvFile: File;
  templateDescription: any;
  templateVariables: any[] = [];

  constructor(
    private loadingService: LoadingService,
    private iframeService: IframeService,
    private configurationService: ConfigurationService,
    private notificationService: NotificationService
  ) {}

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
    await this.getConfigurations(this.template.name);
    const notificationObj: NotificationCsv = {
      phoneColumn: this.phoneColumn,
      senderEmail: this.email,
      template: this.template.name,
      languageCode: this.template.language,
      wabanamespace: this.bucketTemplate.namespace,
      masterState: this.bucketTemplate.masterState,
      flowId: this.bucketTemplate.flowId,
      stateId: this.bucketTemplate.stateId,
      formFile: this.csvFile
    };
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
}
