import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/shared/material/material-components.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BroadRoutingModule } from './broad-routing.module';
import { BroadComponent } from './broad.component';
import { BlipService } from '@app/services/blip.service';
import { NotificationService } from '@app/services/notification.service';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { IndividualComponent } from './individual/individual.component';
import { SheetComponent } from './sheet/sheet.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationGeneralComponent } from './configuration-general/configuration-general.component';
import { ConfigurationGeneralService } from '@app/services/configuration-general.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MaterialModule,
    MaterialFileInputModule,
    BroadRoutingModule
  ],
  declarations: [BroadComponent, IndividualComponent, SheetComponent, ConfigurationComponent, ConfigurationGeneralComponent],
  providers: [BlipService, NotificationService, ConfigurationGeneralService]
})
export class BroadModule {}
