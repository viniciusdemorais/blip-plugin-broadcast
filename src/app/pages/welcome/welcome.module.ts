import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { WelcomeComponent } from './welcome.component';
import { MaterialModule } from '@app/shared/material/material-components.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { IframeService } from '@app/services/iframe.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MaterialModule,
    WelcomeRoutingModule
  ],
  declarations: [WelcomeComponent],
  providers: [IframeService]
})
export class WelcomeModule {}
