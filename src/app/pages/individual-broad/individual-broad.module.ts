import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/shared/material/material-components.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndividualBroadRoutingModule } from './individual-broad-routing.module';
import { IndividualBroadComponent } from './individual-broad.component';
import { BlipService } from '@app/services/blip.service';
import { NotificationService } from '@app/services/notification.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MaterialModule,
    IndividualBroadRoutingModule
  ],
  declarations: [IndividualBroadComponent],
  providers: [BlipService, NotificationService]
})
export class IndividualBroadModule {}
