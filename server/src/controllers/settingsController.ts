import { Request, Response } from 'express';
import { pool } from '../index';
import bcrypt from 'bcrypt';
import { User, UpdateUserSettings } from '../types';

// Get user settings by ID
export const getUserSettings = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const result = await pool.query<User>('SELECT id, username, email, first_name, last_name, phone_number FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update user settings by ID
export const updateUserSettings = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { username, email, password, firstName, lastName, phoneNumber }: UpdateUserSettings = req.body;
  try {
    // If password is provided, hash it
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user in the database
    const result = await pool.query<User>(
      'UPDATE users SET username = $1, email = $2, password = COALESCE($3, password), first_name = $4, last_name = $5, phone_number = $6 WHERE id = $7 RETURNING id, username, email, first_name, last_name, phone_number',
      [username, email, hashedPassword, firstName, lastName, phoneNumber, userId]
    );

    const updatedUser = result.rows[0];
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user account by ID
export const deleteUserAccount = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
    const deletedUser = result.rows[0];
    if (deletedUser) {
      res.status(200).json({ message: 'User account deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
