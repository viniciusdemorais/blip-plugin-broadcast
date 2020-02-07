import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/shared/material/material-components.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndividualBroadRoutingModule } from './individual-broad-routing.module';
import { IframeService } from '@app/services/iframe.service';
import { IndividualBroadComponent } from './individual-broad.component';

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
  providers: [IframeService]
})
export class IndividualBroadModule {}
