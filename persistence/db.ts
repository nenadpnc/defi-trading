import loki from 'lokijs';
import { nanoid } from 'nanoid';
import { Fund, Order, TokenType } from '../types';

// in-memory database
class DB {
  private db: loki;
  private funds: Collection<Fund>;
  private orders: Collection<Order>;

  constructor() {
    this.db = new loki('persistence/db.json');
    this.funds = this.db.getCollection('funds') ?? this.db.addCollection('funds', {
      unique: ['id'],
      indices: ['address', 'token']
    });
    this.orders = this.db.getCollection('orders') ?? this.db.addCollection('orders', {
      unique: ['id'],
      indices: ['address', 'token']
    });
  }

  public getAllFunds() {
    return this.funds.find();
  }
  
  public getAllOrders() {
    return this.orders.find();
  }

  public addFund(item: Omit<Fund, 'id' | 'createdAt' | 'updatedAt'>) {
    const fund: Fund = {
      ...item,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.funds.insert(fund);
    this.db.save();
    return fund.id;
  }

  public addOrder(item: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const order: Order = {
      ...item,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.orders.insert(order);
    this.db.save();
    return order.id;
  }

  public getFundsByAddressAndToken(address: string, token: TokenType) {
    return this.funds.chain().find({ address: address, token: token }).simplesort('updatedAt', true).data();
  }

  public getOrdersByAddressAndToken(address: string, token: TokenType) {
    return this.orders.chain().find({ address: address, token: token }).simplesort('updatedAt', true).data();
  }

  public getOrderById(id: string) {
    return this.orders.findOne({ id: id });
  }

  public cancelOrder(id: string) {
    this.orders.findAndUpdate({ id: id }, (order) => {
      order.status = 'CANCELED';
      order.updatedAt = new Date();
      return order;
    });
    this.db.save();
  }
}

export default new DB();
