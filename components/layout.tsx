import { PropsWithChildren, ReactElement, useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import useIsLoggedIn from '../hooks/useIsLoggedIn';
import Footer from './footer';

export default function Layout({ children }: PropsWithChildren<{}>): ReactElement {
    const isLoggedIn = useIsLoggedIn();
    const router = useRouter();

    useEffect(() => {
      if (isLoggedIn === false && router.pathname !== '/login') {
        router.replace('/login');
      }
    }, [isLoggedIn, router]);

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
            {!isLoggedIn && router.pathname !== '/login' ? <>Initialising...</> : children}
          </div>
        </main>
        <Footer />
      </div>
    )
  }