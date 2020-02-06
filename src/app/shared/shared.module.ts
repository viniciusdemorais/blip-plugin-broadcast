import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LoaderComponent, PageLoaderComponent],
  exports: [LoaderComponent, PageLoaderComponent]
})
export class SharedModule {}
