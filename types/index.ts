import { TOKENS, SIDES } from '../constants';

export type TokenType = typeof TOKENS[number];

export type Side = typeof SIDES[number];

export type OrderStatus = 'OPEN' | 'CANCELED';

export interface Fund {
  id: string;
  token: TokenType;
  amount: number;
  address: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  token: TokenType;
  amount: number;
  price: number;
  address: string;
  side: Side;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
