import { FormEvent, useState, ReactElement } from 'react';
import Link from 'next/link';
import { useMetaMask } from 'metamask-react';
import Layout from '../components/layout';
import { getOrders, placeOrder, cancelOrder } from '../utils/httpsService';
import { TOKENS, SIDES, pricesInDollars } from '../constants';
import { TokenType, Order, Side } from '../types';
import styles from '../styles/Home.module.css';

const OrderPage = () => {
  const [amount, setAmount] = useState<number>(0);
  const { account } = useMetaMask();
  const [token, setToken] = useState<TokenType>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [side, setSide] = useState<Side>('BUY');

  const handleOrderSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    await placeOrder(account as string, amount, token as TokenType, side);
    const { orders } = await getOrders(account as string, token as TokenType);
    setOrders(orders);
  }

  const handleSelectToken = async (token: TokenType) => {
    try {
      setToken(token);
      const { orders } = await getOrders(account as string, token);
      setOrders(orders);
    } catch (error) {
      setOrders([]);
      console.log(error);
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(account as string, orderId);
      const { orders } = await getOrders(account as string, token as TokenType);
      setOrders(orders);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Link href="/">
        <a>
          <h2> &larr; Back</h2>
        </a>
      </Link>
      <div className={`${styles.card} ${styles.cardSingle}`}>
        <form onSubmit={(e) => handleOrderSubmit(e)}>
          <h2>Orders</h2>
          <div className={`${styles['mt-10']} ${styles['flex-center']}`}>
            <label htmlFor="amount">Amount</label>
            <input
              name="amount"
              id="amount"
              type="number"
              value={amount}
              min={0}
              step={0.01}
              onChange={(e) => setAmount(e.target.valueAsNumber || 0)} />
          </div>

          <div className={styles['mt-10']}>
            <fieldset id="tokens">
              <legend>Tokens</legend>
              {TOKENS.map((item) => (
                  <div className={styles['tokens']} key={item}>
                    <label htmlFor={item}>{item}</label>
                    <input
                      type="radio"
                      value={item}
                      id={item}
                      checked={item === token}
                      onChange={(e) => handleSelectToken(e.currentTarget.value as TokenType)}
                      name="tokens" />
                  </div>
                )
              )}
            </fieldset>
          </div>

          <div className={styles['mt-10']}>
            <fieldset id="side">
              <legend>Side</legend>
              {SIDES.map((item) => (
                  <div className={styles['tokens']} key={item}>
                    <label htmlFor={item}>{item}</label>
                    <input
                      type="radio"
                      value={item}
                      id={item}
                      checked={item === side}
                      onChange={(e) => setSide(e.currentTarget.value as Side)}
                      name="side" />
                  </div>
                )
              )}
            </fieldset>
          </div>

          <div className={styles['mt-10']}>
            <button
              disabled={!token || !amount || !side}
              type="submit"
              className={`${styles.button} ${styles['submit-btn']}`}>
                Submit order
            </button>
            <span className={styles['ml-20']}>{token ? 
              `Price: ${new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(amount * pricesInDollars[token])}` :
              ''
            }</span>
          </div>
        </form>
      </div>
      <div className={`${styles.card} ${styles.cardSingle}`}>
        <h2>Orders {token}</h2>
        <div className={styles['mt-10']}>
          {token ? (
            orders.map((item) => (
              <div key={item.id} className={styles.balances}>
                <div>{new Date(item.updatedAt).toLocaleString()}</div>
                <div>{item.side}</div>
                <div>{item.amount}</div>
                <div>{item.token}</div>
                <div>{item.status}</div>
                {item.status !== 'CANCELED' ? (
                  <button
                    className={`${styles.button} ${styles['cancel-btn']}`}
                    onClick={() => handleCancelOrder(item.id)}>
                      Cancel
                  </button>
                ) : ''}
              </div>
            ))
          ) : 'Select token to see orders.'}
        </div>
      </div>
    </>
  )
}

OrderPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default OrderPage;
