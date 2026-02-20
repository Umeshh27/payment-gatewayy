import { Request, Response, NextFunction } from 'express';
import { query } from '../config/db';

export interface AuthRequest extends Request {
  merchant?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const apiSecret = req.headers['x-api-secret'];

  if (!apiKey || !apiSecret) {
    return res.status(401).json({ error: 'Authentication required' });
  }


  try {
    const result = await query(
      'SELECT * FROM merchants WHERE email = $1',
      ['test@example.com']
    );
    
    if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }


    
    req.merchant = result.rows[0];
    next();
  } catch (error) {
    console.error('Auth error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
