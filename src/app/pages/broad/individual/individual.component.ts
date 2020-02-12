import { OnInit, OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { BlipService } from '@app/services/blip.service';
import { ConfigurationService } from '@app/services/configuration.service';
import { NotificationService } from '@app/services/notification.service';
import { NotificationIndividual } from '@app/models/NotificationIndividual';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core';

@Component({
  selector: 'app-broad-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})
export class IndividualComponent implements OnInit, OnDestroy {
  unsub = new Subject();

  loading = false;
  showTemplate = false;

  phoneNumber: string;
  email: string;
  namespace: string;

  templates: any[];
  template: any;
  botId: any;
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

  async sendNotification() {
    this.loading = true;

    const bucket = await this.getConfigurations(this.template.name);

    const notificationObj: NotificationIndividual = {
      telephone: this.phoneNumber,
      template: this.template.name,
      language_code: this.template.language,
      master_state: this.template.language,
      flow_id: this.template.language,
      state_id: this.template.language,
      namespace: this.namespace,
      params: this.variableValues(this.templateVariables),
      sender_email: this.email,
      trackOrigin: true
    };
    this.notificationService
      .sendIndividualNotification(notificationObj, this.botId, this.accessKey)
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

  async getConfigurations(variable: any) {
    const bucket = await this.configurationService.getBucket(variable);
    return bucket;
  }
}
