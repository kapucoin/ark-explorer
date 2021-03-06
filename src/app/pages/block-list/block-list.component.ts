import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

import { ExplorerService } from '../../shared/services/explorer.service';
import { CurrencyService } from '../../shared/services/currency.service';
import { ConnectionMessageService } from "../../shared/services/connection-message.service";
import { initCurrency } from '../../shared/const/currency';

@Component({
  selector: 'ark-block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.less'],
  providers: [ExplorerService]
})
export class BlockListComponent implements OnInit, OnDestroy {
  public blocks: any = [];
  public pagination: any = [];
  public currencyName: string = initCurrency.name;
  public currencyValue: number = initCurrency.value;
  public showLoader: boolean = false;

  private subscription: Subscription;
  private _currentPage: number = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _explorerService: ExplorerService,
    private _currencyService: CurrencyService,
    private _connectionService: ConnectionMessageService
  ) {
    this.subscription = _currencyService.currencyChoosen$.subscribe(currency => {
      this.currencyName = currency.name;
      this.currencyValue = currency.value;
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.showLoader = true;
    this.route.params.subscribe((params: Params) => {
      this._currentPage = +params["page"];

      let queryParams = this._currentPage*20 - 20;
      
      this._explorerService.getLastBlocks(queryParams).subscribe(
        res => {
          this.blocks = res.blocks;
          this.pagination = res.pagination;
          this._connectionService.changeConnection(res.success);
          this.showLoader = !res.success;
        }
      );      
    });
  }

  goToAddress(event, id: string) {
    event.preventDefault();
    this.router.navigate(['/address', id]);
  }

  goToBlock(event, id: string) {
    event.preventDefault();
    this.router.navigate(['/block', id]);
  }

  goToPage(page: number) {
    this.blocks = [];
    this.showLoader = true;
    this.router.navigate(['/blocks', page]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
