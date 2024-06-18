import { Request, Response } from 'express';
import { pool } from '../index';
import { Category } from '../types';

export const createCategory = async (req: Request, res: Response) => {
  const { name }: Category = req.body;
  try {
    const result = await pool.query<Category>('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
    const newCategory = result.rows[0];
    res.status(201).json(newCategory);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Category[]>('SELECT * FROM categories');
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.id);
  const { name }: Category = req.body;
  try {
    const result = await pool.query<Category>('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, categoryId]);
    const updatedCategory = result.rows[0];
    if (updatedCategory) {
      res.json(updatedCategory);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [categoryId]);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
