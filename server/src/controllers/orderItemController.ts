import { Request, Response } from 'express';
import { pool } from '../index';
import { OrderItem } from '../types';

export const addOrderItem = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.orderId);
  const { productId, quantity }: OrderItem = req.body;
  try {
    const result = await pool.query<OrderItem>(
      'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [orderId, productId, quantity]
    );
    const newOrderItem = result.rows[0];
    res.status(201).json(newOrderItem);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderItemsByOrder = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.orderId);
  try {
    const result = await pool.query<OrderItem[]>('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderItem = async (req: Request, res: Response) => {
  const orderItemId = parseInt(req.params.id);
  const { quantity }: OrderItem = req.body;
  try {
    const result = await pool.query<OrderItem>(
      'UPDATE order_items SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, orderItemId]
    );
    const updatedOrderItem = result.rows[0];
    if (updatedOrderItem) {
      res.json(updatedOrderItem);
    } else {
      res.status(404).json({ error: 'Order item not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrderItem = async (req: Request, res: Response) => {
  const orderItemId = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM order_items WHERE id = $1', [orderItemId]);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
