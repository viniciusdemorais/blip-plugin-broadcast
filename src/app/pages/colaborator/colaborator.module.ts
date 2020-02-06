import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { ColaboratorRoutingModule } from './colaborator-routing.module';
import { ColaboratorComponent } from './colaborator.component';
import { MaterialModule } from '@app/shared/material/material-components.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColaboradorService } from '@app/services/colaborador.service';
import { AreaService } from '@app/services/area.service';
import { CidadeService } from '@app/services/cidade.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    MaterialModule,
    ColaboratorRoutingModule
  ],
  declarations: [ColaboratorComponent],
  providers: [AreaService, ColaboradorService, CidadeService]
})
export class ColaboratorModule {}
