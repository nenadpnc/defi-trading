import { useState, useEffect } from 'react';
import { useMetaMask } from 'metamask-react';
import verifyUser from '../utils/verifyUser';

function useIsLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { status, account } = useMetaMask();

  useEffect(() => {
    if (status === 'notConnected' || status === 'unavailable') {
      setIsLoggedIn(false);
      return;
    }

    if (status === 'connected') {
      verifyUser(account).then(isLoggedIn => setIsLoggedIn(isLoggedIn));
    }
  }, [status, account]);

  return isLoggedIn;
}

export default useIsLoggedIn;