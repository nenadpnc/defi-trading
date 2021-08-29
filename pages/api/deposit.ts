import type { NextApiRequest, NextApiResponse } from 'next';
import { TOKENS } from '../../constants';
import withAuth from '../../middlewares/withAuth';
import db from '../../persistence/db';
import { TokenType } from '../../types';

type Data = {
  status?: string
  error?: {
    statusCode: number,
    message: string
  }
}

const validate = (req: NextApiRequest) => {
  if (req.method !== 'POST') {
    throw new Error('Invalid HTTP method');
  }

  if (!req.body.amount) {
    throw new Error('Amount is required');
  }

  const token = req.body.token as TokenType;
  if (!token || !TOKENS.includes(token)) {
    throw new Error('Missing or invalid token');
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    validate(req);
    const amount = req.body.amount as unknown as number;
    const token = req.body.token as TokenType;
    const address = req.headers['x-address'] as string;

    db.addFund({
      amount,
      token,
      address,
      status: 'accepted'
    });

    console.log(`[FUNDS DEPOSITED]: ${amount} ${token}`);

    res.status(200).json({ status: 'accepted' });
  } catch (e) {
    res.status(400).json({ error: { statusCode: 400, message: e.message } });
  }
}

export default withAuth(handler);
