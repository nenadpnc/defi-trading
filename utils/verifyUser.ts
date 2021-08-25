import getWeb3 from '../utils/getWeb3';

const verifyUser = async (account: string | null) => {
  const web3 = getWeb3();

  const currentSignature = localStorage.getItem('signature');

  if (currentSignature) {
    const address = await web3.eth.personal.ecRecover('auth', currentSignature);
    if (address === account) {
      return true;
    }
  }

  const password = window.prompt('Enter your password', '');
  if (password && account) {
    const signature = await web3.eth.personal.sign('auth', account, password);
    localStorage.setItem('signature', signature);
    return true;
  }

  return false;
}
export default verifyUser;