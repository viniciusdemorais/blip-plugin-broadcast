import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '@app/shared/material/material-components.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { BlipService } from '@app/services/blip.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MaterialModule,
    DashboardRoutingModule
  ],
  declarations: [DashboardComponent],
  providers: [BlipService]
})
export class DashboardModule {}
