import type { NextApiRequest, NextApiResponse } from 'next';
import { pricesInDollars, SIDES, TOKENS } from '../../constants';
import withAuth from '../../middlewares/withAuth';
import db from '../../persistence/db';
import { Side, TokenType } from '../../types';

type Data = {
  id?: string
  error?: {
    statusCode: number,
    message: string
  }
}

const validate = (req: NextApiRequest) => {
  const { amount, price, side, token } = req.body;
  if (req.method !== 'POST') {
    throw new Error('Invalid HTTP method');
  }
  if (!amount || typeof amount !== 'number') {
    throw new Error('Invalid amount');
  }
  if (!side || !SIDES.includes(side)) {
    throw new Error('Invalid side');
  }
  if (!token || !TOKENS.includes(token)) {
    throw new Error('Invalid token');
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    validate(req);
    const amount = req.body.amount as unknown as number;
    const token = req.body.token as TokenType;
    const side = req.body.side as Side;
    const address = req.headers['x-address'] as string;
    const price = amount * pricesInDollars[token];

    const id = db.addOrder({
      amount,
      price,
      side,
      token,
      address,
      status: 'OPEN'
    });

    console.log(`PLACED [${side}] @ [${price}] [${amount}]`);

    res.status(200).json({ id });
  } catch (e) {
    res.status(400).json({ error: { statusCode: 400, message: e.message } });
  }
}

export default withAuth(handler);
