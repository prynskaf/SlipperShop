import { Request, Response } from 'express';
import { pool } from '../index';
import { Review } from '../types';

export const getReviewsByProduct = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId);
  try {
    const result = await pool.query<Review[]>('SELECT * FROM reviews WHERE product_id = $1', [productId]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createReview = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId);
  const { userId, rating, comment }: Review = req.body;
  try {
    const result = await pool.query<Review>(
      'INSERT INTO reviews (product_id, user_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *',
      [productId, userId, rating, comment]
    );
    const newReview = result.rows[0];
    res.status(201).json(newReview);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  const reviewId = parseInt(req.params.id);
  const { rating, comment }: Review = req.body;
  try {
    const result = await pool.query<Review>(
      'UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3 RETURNING *',
      [rating, comment, reviewId]
    );
    const updatedReview = result.rows[0];
    if (updatedReview) {
      res.json(updatedReview);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  const reviewId = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
