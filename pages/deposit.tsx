
import Link from 'next/link';
import type { ReactElement } from 'react'
import Layout from '../components/layout';
import styles from '../styles/Home.module.css';

const Deposit = () => {
  return (
    <>
      <Link href="/deposit">
        <a className={styles.card}>
          <h2 className={styles.margin0}>Deposit funds &rarr;</h2>
        </a>
      </Link>

      <Link href="/sumbit">
        <a className={styles.card}>
          <h2 className={styles.margin0}>Submit orders &rarr;</h2>
        </a>
      </Link>
    </>
  )
}

Deposit.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Deposit
