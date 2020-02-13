import { OnInit, Input, Component, OnDestroy } from '@angular/core';
import { LoadingService } from '@app/services/loading.service';
import { untilDestroyed } from '@app/core';
@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss']
})
export class PageLoaderComponent implements OnInit, OnDestroy {
  @Input() hidde = true;
  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.customObservable.pipe(untilDestroyed(this)).subscribe((value: boolean) => {
      this.hidde = !value;
    });
  }

  ngOnDestroy() {}
}
