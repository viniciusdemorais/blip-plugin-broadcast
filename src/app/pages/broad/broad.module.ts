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
  declarations: [BroadComponent],
  providers: [BlipService, NotificationService]
})
export class BroadModule {}
