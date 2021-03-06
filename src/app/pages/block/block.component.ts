import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { ExplorerService } from '../../shared/services/explorer.service';
import { CurrencyService } from '../../shared/services/currency.service';
import { ConnectionMessageService } from "../../shared/services/connection-message.service";
import { initCurrency } from '../../shared/const/currency';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.less'],
  providers: [ExplorerService]
})
export class BlockComponent implements OnInit, OnDestroy {
  public block: any;
  public transactions: any[] = [];
  public currencyName: string = initCurrency.name;
  public currencyValue: number = initCurrency.value;

  private subscription: Subscription;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
    this.route.params.subscribe((params: Params) => {
      this._explorerService.getBlock(params["id"]).subscribe(
        res => {
          this.block = res.block;
          this._connectionService.changeConnection(res.success);
        }
      );

      this._explorerService.getTransactionsByBlock(params["id"]).subscribe(
        res => {
          this.transactions = res.transactions;
          // this._connectionService.changeConnection(res.success);
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

  goToTransaction(event, id: string) {
    event.preventDefault();
    this.router.navigate(['/tx', id]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
