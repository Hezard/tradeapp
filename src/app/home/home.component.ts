import { Component, OnInit } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { groupBy } from 'lodash';
import { timer } from 'rxjs/observable/timer';
import { switchMap, takeWhile } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { Order, OrderList } from '../models';
import { ApiService } from '../services/api.service';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ backgroundColor: '#fe3', transform: 'scale(0.8)', opacity: 0 }),
        animate('.5s cubic-bezier(0.65, 0.05, 0.36, 1)',
          style({ backgroundColor: 'transparent', transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('.5s cubic-bezier(0.65, 0.05, 0.36, 1)',
          style({ transform: 'scale(0.8)', opacity: 0, height: '0px' }))
      ]),
    ])
  ],
})
export class HomeComponent implements OnInit {
  selectedOrder: number;
  orderList: OrderList;
  timerSubscription:  Subscription;

  constructor(private api: ApiService, private orders: OrdersService) { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders(start = 0, size = 20) {
    this.orderList = { sellers: [], buyers: [], matches: [] };
    this.timerSubscription = timer(0, 3000).pipe(
      takeWhile(() => start < 200),
      switchMap(() => {
        return this.api.get<Order[]>('/listOrders', {start, size});
      }),
    ).subscribe(response => {
      start += response.length;
      const {buy = [], sell = []} = groupBy(response, (item) => item.type);

      this.orderList.sellers = this.orders.orderBy([...this.orderList.sellers, ...sell], 'price', 'desc');
      this.orderList.buyers = this.orders.orderBy([...this.orderList.buyers, ...buy], 'price', 'asc');
      this.orderList.matches = this.orders.matchOrders(this.orderList);
    });
  }

  selectRow(date) {
    if (date === this.selectedOrder) {
      this.selectedOrder = null;
      return;
    }
    this.selectedOrder = date;
  }

  resetOrders() {
    this.api.get('/reset').subscribe( repsonse => {
      this.timerSubscription.unsubscribe();
      this.getOrders();
      console.log('reset was done!');
    });
  }
}
