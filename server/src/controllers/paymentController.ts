import { Request, Response } from 'express';
import { pool } from '../index';
import { Payment } from '../types';

export const getPayments = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Payment[]>('SELECT * FROM payments');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.id);
  try {
    const result = await pool.query<Payment>('SELECT * FROM payments WHERE id = $1', [paymentId]);
    const payment = result.rows[0];
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const processPayment = async (req: Request, res: Response) => {
  const { orderId, amount, paymentMethod }: Payment = req.body;

  try {
    // Retrieve the total_amount of the order from the database
    const orderResult = await pool.query('SELECT total_amount FROM orders WHERE id = $1', [orderId]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderTotal = orderResult.rows[0].total_amount;

    // Check if the amount matches the order total
    if (amount !== orderTotal) {
      return res.status(400).json({ error: 'Payment amount does not match order total', expectedTotal: orderTotal, actualAmount: amount });
    }

    // Perform payment processing logic here
    // For example, insert payment details into the database
    const result = await pool.query<Payment>(
      'INSERT INTO payments (order_id, amount, payment_method, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [orderId, amount, paymentMethod, 'success']
    );

    const newPayment = result.rows[0];
    res.status(201).json(newPayment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
