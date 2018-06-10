export interface Order {
  id: number;
  type: 'sell' | 'buy';
  quantity: number;
  price: number;
}

export interface OrderList {
  sellers: Order[];
  buyers: Order[];
  matches: MatchOrder[];
}

export interface MatchOrder {
  buyOrder: Order;
  sellOrder: Order;
  volume: number;
  price: number;
  date: Date;
}

