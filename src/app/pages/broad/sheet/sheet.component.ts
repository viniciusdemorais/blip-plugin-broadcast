import { OnInit, OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { BlipService } from '@app/services/blip.service';
import { ConfigurationService } from '@app/services/configuration.service';
import { NotificationService } from '@app/services/notification.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core';
import { NotificationCsv } from '@app/models/NotificationCsv';

@Component({
  selector: 'app-broad-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss']
})
export class SheetComponent implements OnInit, OnDestroy {
  unsub = new Subject();
  loading = false;
  showTemplate = false;

  email: string;
  namespace: string;
  phoneColumn: string;

  templates: any[];
  template: any;
  botId: any;
  csvFile: File;
  accessKey: any;
  templateDescription: any;
  templateVariables: any[] = [];

  constructor(
    private blipService: BlipService,
    private configurationService: ConfigurationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getTemplates();
    this.getApplications();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
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

  sendCsvNotification() {
    this.loading = true;
    const notificationObj: NotificationCsv = {
      phoneColumn: this.phoneColumn,
      senderEmail: this.email,
      template: this.template.name,
      languageCode: this.template.language,
      wabanamespace: this.namespace,
      formFile: this.csvFile
    };
    this.notificationService
      .sendCsvNotification(notificationObj, this.botId, this.accessKey)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        res => {
          console.log('Funciona de mais');
        },
        error => {
          console.log('Deu Ruim');
        }
      );
  }
}
