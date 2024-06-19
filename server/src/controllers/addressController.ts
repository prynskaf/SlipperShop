import { Request, Response } from 'express';
import { pool } from '../index';
import { Address } from '../types';

export const createAddress = async (req: Request, res: Response) => {
  const { userId, street, city, state, zipCode }: Address = req.body;
  try {
    const result = await pool.query<Address>(
      'INSERT INTO addresses (user_id, street, city, state, zip_code) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, street, city, state, zipCode]
    );
    const newAddress = result.rows[0];
    res.status(201).json(newAddress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const getAddressesByUser = async (req: Request, res: Response) => {
  const userId = req.User.id; // Assuming req.User contains the authenticated user's information
  console.log(userId);
  // const userId = 2;

  try {
    const result = await pool.query<Address[]>('SELECT * FROM addresses WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err: any) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
};



export const updateAddress = async (req: Request, res: Response) => {
  const addressId = parseInt(req.params.id);
  const { street, city, state, zipCode }: Address = req.body;
  try {
    const result = await pool.query<Address>(
      'UPDATE addresses SET street = $1, city = $2, state = $3, zip_code = $4 WHERE id = $5 RETURNING *',
      [street, city, state, zipCode, addressId]
    );
    const updatedAddress = result.rows[0];
    if (updatedAddress) {
      res.json(updatedAddress);
    } else {
      res.status(404).json({ error: 'Address not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  const addressId = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM addresses WHERE id = $1', [addressId]);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
