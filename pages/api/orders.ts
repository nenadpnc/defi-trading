import type { NextApiRequest, NextApiResponse } from 'next';
import { TOKENS } from '../../constants';
import withAuth from '../../middlewares/withAuth';
import db from '../../persistence/db';
import type { Order, TokenType } from '../../types';

type Data = {
  orders?: Order[]
  error?: {
    statusCode: number,
    message: string
  }
}

const validate = (req: NextApiRequest) => {
  if (req.method !== 'GET') {
    throw new Error('Invalid HTTP method');
  }
  const token = req.query.token as TokenType;
  if (!token || !TOKENS.includes(token)) {
    throw new Error('Missing or invalid token');
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    validate(req);
    const address = req.headers['x-address'] as string;
    const token = req.query.token as TokenType;
    const orders = db.getOrdersByAddressAndToken(address, token);
    res.status(200).json({ orders });
  } catch (e) {
    res.status(400).json({ error: { statusCode: 400, message: e.message } });
  }
}

export default withAuth(handler);
