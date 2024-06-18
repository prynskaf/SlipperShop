import { Request, Response } from 'express';
import { pool } from '../index';
import { ProductSize } from '../types';

export const addProductSize = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId);
  const { size, quantity }: ProductSize = req.body;
  try {
    const result = await pool.query<ProductSize>(
      'INSERT INTO product_sizes (product_id, size, quantity) VALUES ($1, $2, $3) RETURNING *',
      [productId, size, quantity]
    );
    const newProductSize = result.rows[0];
    res.status(201).json(newProductSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductSizes = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId);
  try {
    const result = await pool.query<ProductSize[]>('SELECT * FROM product_sizes WHERE product_id = $1', [productId]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProductSize = async (req: Request, res: Response) => {
  const productSizeId = parseInt(req.params.id);
  const { size, quantity }: ProductSize = req.body;
  try {
    const result = await pool.query<ProductSize>(
      'UPDATE product_sizes SET size = $1, quantity = $2 WHERE id = $3 RETURNING *',
      [size, quantity, productSizeId]
    );
    const updatedProductSize = result.rows[0];
    if (updatedProductSize) {
      res.json(updatedProductSize);
    } else {
      res.status(404).json({ error: 'Product size not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProductSize = async (req: Request, res: Response) => {
  const productSizeId = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM product_sizes WHERE id = $1', [productSizeId]);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
