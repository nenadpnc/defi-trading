import { FormEvent, useState, ReactElement } from 'react';
import Link from 'next/link';
import { useMetaMask } from 'metamask-react';
import Layout from '../components/layout';
import { depositFunds, getBalances } from '../utils/httpsService';
import { TOKENS } from '../constants';
import { TokenType, Fund } from '../types';
import styles from '../styles/Home.module.css';

const DepositPage = () => {
  const [amount, setAmount] = useState<number>(0);
  const [token, setToken] = useState<TokenType>();
  const [balances, setBalances] = useState<Fund[]>([]);
  const { account } = useMetaMask();

  const handleDepositSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await depositFunds(account as string, amount, token as TokenType);
      const { balances } = await getBalances(account as string, token as TokenType);
      setBalances(balances);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSelectToken = async (token: TokenType) => {
    try {
      setToken(token);
      const { balances } = await getBalances(account as string, token);
      setBalances(balances);
    } catch (error) {
      setBalances([]);
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
        <form onSubmit={(e) => handleDepositSubmit(e)}>
          <h2>Deposit funds</h2>
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
            <button
              disabled={!token || !amount}
              type="submit"
              className={`${styles.button} ${styles['submit-btn']}`}>
                Deposit
            </button>
          </div>
        </form>
      </div>
      <div className={`${styles.card} ${styles.cardSingle}`}>
        <h2>Balances {token}</h2>
        <div className={styles['mt-10']}>
          {token ? (
            balances.map((item) => (
              <div key={item.id} className={styles.balances}>
                <div>{new Date(item.updatedAt).toLocaleString()}</div>
                <div>{item.amount}</div>
                <div>{item.token}</div>
              </div>
            ))
          ) : 'Select token to see balances.'}
        </div>
      </div>
    </>
  )
}

DepositPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default DepositPage
