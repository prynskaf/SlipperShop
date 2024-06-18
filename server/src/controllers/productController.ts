import {Request , Response } from 'express';
import {pool} from '../index'
import {Product }  from '../types';

// GET ALL PRODUCTS
export const getProducts =  async (req: Request, res: Response) => {
    try {
        const result = await pool.query<Product>('SELECT * FROM products');
        res.status(200).json(result.rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}



// GET PRODUCT BY ID
export const getProductById = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    try {
      const result = await pool.query<Product>('SELECT * FROM products WHERE id = $1', [productId]);
      const product = result.rows[0];
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (err : any) {
      res.status(500).json({ error: err.message });
    }
  };
  
//   CREATE PRODUCT
export const createProduct = async (req: Request, res: Response) => {
    const { name, description, price, imageUrl, categoryId }: Product = req.body;
    try {
      const result = await pool.query<Product>(
        'INSERT INTO products (name, description, price, image_url, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, price, imageUrl, categoryId]
      );
      const newProduct = result.rows[0];
      res.status(201).json(newProduct);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

//   UPDATE PRODUCT
export const updateProduct = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const { name, description, price, imageUrl, categoryId }: Product = req.body;
    try {
      const result = await pool.query<Product>(
        'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category_id = $5 WHERE id = $6 RETURNING *',
        [name, description, price, imageUrl, categoryId, productId]
      );
      const updatedProduct = result.rows[0];
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };


//   DELETE PRODUCTS
export const deleteProduct = async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    try {
      await pool.query('DELETE FROM products WHERE id = $1', [productId]);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
};