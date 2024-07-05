import { Request, Response } from 'express';
import { pool } from '../index';
import { Order } from '../types';

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Order[]>('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);
  try {
    const result = await pool.query<Order>('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = result.rows[0];
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  const { userId, totalAmount, status }: Order = req.body;
  try {
    const result = await pool.query<Order>(
      'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, totalAmount, status]
    );
    const newOrder = result.rows[0];
    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing order
export const updateOrder = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);
  const { userId, totalAmount, status }: Order = req.body;
  try {
    const result = await pool.query<Order>(
      'UPDATE orders SET user_id = $1, total_amount = $2, status = $3 WHERE id = $4 RETURNING *',
      [userId, totalAmount, status, orderId]
    );
    const updatedOrder = result.rows[0];
    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an order
export const deleteOrder = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
