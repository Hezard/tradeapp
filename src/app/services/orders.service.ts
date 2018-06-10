import { Injectable } from '@angular/core';
import { orderBy } from 'lodash';
import { Order, OrderList } from '../models';

@Injectable()
export class OrdersService {

  matchOrders({sellers, buyers, matches}: OrderList) {
    if (!sellers.length || !buyers.length) {
      return matches;
    }

    const {order: buyOrder, index: buyIndex } = this.findBuyOrder(buyers);
    const sellIndex = sellers.findIndex((order) => {
      if (order.price < buyOrder.price) {
        return true;
      }
      return false;
    });

    if (sellIndex !== -1) {
      const sellOrder = sellers[sellIndex];
      const diff = buyOrder.quantity - sellOrder.quantity;

      matches.unshift({
        buyOrder: {...buyOrder},
        sellOrder: {...sellOrder},
        volume: Math.min(buyOrder.quantity, sellOrder.quantity),
        price: (buyOrder.price + sellOrder.price) / 2,
        date: new Date()
      });

      if (diff === 0) {
        buyers.splice(buyIndex, 1);
        sellers.splice(sellIndex, 1);
      } else if (diff > 0) {
        sellers.splice(sellIndex, 1);
        buyOrder.quantity = diff;
      } else {
        buyers.splice(buyIndex, 1);
        sellOrder.quantity = Math.abs(diff);
      }

      return this.matchOrders({sellers, buyers, matches});
    }

    return matches;
  }

  orderBy(data: Order[], key: string, sort: string) {
    if (!data) {
      return;
    }
    return orderBy(data, [key], [sort]);
  }

  findBuyOrder([...orders]) {
    const index = orders.length - 1,
      curr = orders[index],
      prev = orders[index - 1];

    if (orders.length > 1 && prev.price === curr.price && prev.id < curr.id) {
      orders.pop();
      return this.findBuyOrder(orders);
    }

    return {order: curr, index};
  }
}
