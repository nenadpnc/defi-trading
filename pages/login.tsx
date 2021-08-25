import type { NextPage } from 'next';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useMetaMask } from 'metamask-react';
import styles from '../styles/Home.module.css';
import useIsLoggedIn from '../hooks/useIsLoggedIn';
import verifyUser from '../utils/verifyUser';
import Footer from '../components/footer';

const Login: NextPage = () => {
  const { status, connect, account } = useMetaMask();
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();

  const renderLogin = () => {
    if (status === 'unavailable') {
      return <h2>MetaMask not available :(</h2>
    }
    if (status === 'notConnected') {
      return (
        <button onClick={connect} className={`${styles.button} ${styles.card} ${styles.cardSingle}`}>
          <h2 className={styles.margin0}>Login with Metamask &rarr;</h2>
        </button>
      )
    }
    if (status === 'connecting') {
      return <h1>Connecting to MetaMask...</h1>;
    }
    if (status === 'connected' && isLoggedIn) {
      router.replace('/');
    }
    if (status === 'connected' && !isLoggedIn) {
      return (
        <button onClick={() => verifyUser(account)} className={`${styles.button} ${styles.card} ${styles.cardSingle}`}>
          <h2 className={styles.margin0}>Login with Metamask &rarr;</h2>
        </button>
      )
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Defi tranding app</title>
        <meta name="description" content="Defi trading test app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Defi trading
        </h1>

        <div className={styles.grid}>
        {isLoggedIn === null ? <>Initialising...</> : renderLogin()}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Login
