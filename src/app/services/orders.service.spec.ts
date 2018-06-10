import { TestBed, inject } from '@angular/core/testing';

import { OrdersService } from './orders.service';
import { Order, OrderList } from '../models';

describe('OrdersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdersService]
    });
  });

  it('should be created', inject([OrdersService], (service: OrdersService) => {
    expect(service).toBeTruthy();
  }));

  it('should find best order in sorted list by price', inject([OrdersService], (service: OrdersService) => {
    const data = getData(),
      result = service.findBuyOrder(data.buyers);

    expect(result).toEqual({
      order: {
        id: 3,
        type: 'buy',
        quantity: 5,
        price: 133
      },
      index: 2
    });
  }));

  it('should not match orders', inject([OrdersService], (service: OrdersService) => {
    const data = getData(),
      result = service.matchOrders(data);
    expect(result.length).toEqual(0);
  }));

  it('should match one order', inject([OrdersService], (service: OrdersService) => {
    const data = getData();
    data.buyers.push({ id: 7, type: 'buy', quantity: 4, price: 200 });

    const result = service.matchOrders(data);

    expect(result.length).toEqual(1);

    expect(result[0]).toEqual(jasmine.objectContaining({
      buyOrder: { id: 7, type: 'buy', quantity: 4, price: 200 },
      sellOrder: { id: 5, type: 'sell', quantity: 5, price: 165 },
      volume: 4,
      price: 182.5
    }));

  }));

  it('should match order with older id', inject([OrdersService], (service: OrdersService) => {
    const data = getData();
    data.buyers.push(
      { id: 8, type: 'buy', quantity: 5, price: 170 },
      { id: 9, type: 'buy', quantity: 3, price: 170 }
    );
    const result = service.matchOrders(data);

    expect(result.length).toEqual(1);

    expect(result[0]).toEqual(jasmine.objectContaining({
      buyOrder: { id: 8, type: 'buy', quantity: 5, price: 170 },
      sellOrder: { id: 5, type: 'sell', quantity: 5, price: 165 },
      volume: 5,
      price: 167.5
    }));

  }));

  it('should match 2 orders', inject([OrdersService], (service: OrdersService) => {
    const data = getData();
    data.buyers.push(
      { id: 8, type: 'buy', quantity: 2, price: 170 },
      { id: 9, type: 'buy', quantity: 3, price: 170 }
    );
    const result = service.matchOrders(data);
    // last order is first in matches
    const [lastOrder, firstOrder] = result;

    expect(result.length).toEqual(2);

    expect(firstOrder).toEqual(jasmine.objectContaining({
      buyOrder: { id: 8, type: 'buy', quantity: 2, price: 170 },
      sellOrder: { id: 5, type: 'sell', quantity: 5, price: 165 },
      volume: 2,
      price: 167.5
    }));

    expect(lastOrder).toEqual(jasmine.objectContaining({
      buyOrder: { id: 9, type: 'buy', quantity: 3, price: 170 },
      sellOrder: { id: 5, type: 'sell', quantity: 3, price: 165 },
      volume: 3,
      price: 167.5
    }));

  }));
});


function getData(): OrderList {
  const data: OrderList = {
    buyers: [
      { id: 1, type: 'buy', quantity: 4, price: 103 },
      { id: 2, type: 'buy', quantity: 2, price: 123 },
      { id: 3, type: 'buy', quantity: 5, price: 133 }
    ],
    sellers: [
      { id: 4, type: 'sell', quantity: 5, price: 235 },
      { id: 5, type: 'sell', quantity: 5, price: 165 }
    ],
    matches: []
  };
  return data;
}
