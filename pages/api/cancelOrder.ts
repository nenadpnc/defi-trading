import type { NextApiRequest, NextApiResponse } from 'next';
import withAuth from '../../middlewares/withAuth';
import db from '../../persistence/db';

type Data = {
  id?: string
  error?: {
    statusCode: number,
    message: string
  }
}

const validate = (req: NextApiRequest) => {
  if (req.method !== 'DELETE') {
    throw new Error('Invalid HTTP method');
  }
  if (!req.query.id) {
    throw new Error('Missing order id');
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    validate(req);
    const id = req.query.id as string;
    const order = db.getOrderById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    db.cancelOrder(id);

    console.log(`CANCELLED [${order.side}] @ [${order.price}] [${order.amount}]`);

    res.status(200).json({ id });
  } catch (e) {
    res.status(400).json({ error: { statusCode: 400, message: e.message } });
  }
}

export default withAuth(handler);
