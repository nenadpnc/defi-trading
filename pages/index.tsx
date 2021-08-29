import Link from 'next/link';
import type { ReactElement } from 'react'
import Layout from '../components/layout';
import styles from '../styles/Home.module.css';

const Home = () => {

  return (
    <>
      <Link href="/deposit">
        <a className={styles.card}>
          <h2 className={styles['ma-0']}>Deposit funds &rarr;</h2>
        </a>
      </Link>

      <Link href="/order">
        <a className={styles.card}>
          <h2 className={styles['ma-0']}>Submit orders &rarr;</h2>
        </a>
      </Link>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Home
