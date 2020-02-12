import { OnInit, OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { BlipService } from '@app/services/blip.service';
import { ConfigurationService } from '@app/services/configuration.service';

@Component({
  selector: 'app-broad-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  unsub = new Subject();
  loading = false;
  showTemplate = false;

  masterState: string;
  flowId: string;
  stateId: string;
  namespace: string;

  templates: any[];
  template: any;
  templateDescription: any;
  templateVariables: any[] = [];

  constructor(private blipService: BlipService, private configurationService: ConfigurationService) {}

  ngOnInit() {
    this.getTemplates();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
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

  selectedTemplateBucket(event: any) {
    this.templateVariables = [];
    this.template = this.templates.find(t => t.id == event.value);
    this.templateDescription = this.template.components.find((td: any) => td.type == 'BODY').text;
  }

  variableId(text: any): string {
    return 'var' + text.replace(/{*}*/g, '');
  }

  async saveConfigurations() {
    const resources = {
      masterState: this.masterState,
      flowId: this.flowId,
      stateId: this.stateId,
      namespace: this.namespace
    };

    const bucket = await this.configurationService.storeBucket(this.template.name, resources);

    return bucket;
  }

  async getConfigurations(variable: any) {
    const bucket = await this.configurationService.getBucket(variable);

    return bucket;
  }
}
