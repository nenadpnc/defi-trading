import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import getWeb3 from '../utils/getWeb3';

const withAuth = (handler: NextApiHandler) => {
  const web3 = getWeb3();
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const signature = req.headers['x-signature'] as string;
      const userAddress = req.headers['x-address'] as string;

      if (!signature || !userAddress) {
        throw new Error('No signature or sender address');
      }

      const address = web3.eth.accounts.recover('auth', signature);

      if (address.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error('Signature does not match address');
      }

      return handler(req, res);
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }
}

export default withAuth;
