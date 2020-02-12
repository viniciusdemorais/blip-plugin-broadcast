import { OnInit, OnDestroy, Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigurationService } from '@app/services/configuration.service';
import { NotificationService } from '@app/services/notification.service';
import { NotificationIndividual } from '@app/models/NotificationIndividual';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core';
import { BucketVariables } from '@app/models/BucketVariables';

@Component({
  selector: 'app-broad-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss']
})
export class IndividualComponent implements OnInit, OnDestroy {
  @Input() templates: any[];
  @Input() botId: any;
  @Input() accessKey: any;
  @Output() loadingStatus = new EventEmitter<boolean>();
  unsub = new Subject();

  showTemplate = false;

  phoneNumber: string;
  email: string;

  template: any;
  templateDescription: any;
  templateVariables: any[] = [];
  bucketTemplate: BucketVariables;

  constructor(private configurationService: ConfigurationService, private notificationService: NotificationService) {}

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
    this.loadingStatus.emit(true);
    await this.getConfigurations(this.template.name);
    const notificationObj: NotificationIndividual = {
      telephone: this.phoneNumber,
      template: this.template.name,
      language_code: this.template.language,
      master_state: this.bucketTemplate.masterState,
      flow_id: this.bucketTemplate.flowId,
      state_id: this.bucketTemplate.stateId,
      namespace: this.bucketTemplate.namespace,
      params: this.variableValues(this.templateVariables),
      sender_email: this.email,
      trackOrigin: true
    };
    this.notificationService
      .sendIndividualNotification(notificationObj, this.botId, this.accessKey)
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this.loadingStatus.emit(false);
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
