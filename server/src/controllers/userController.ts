import { Request, Response } from 'express';
import { pool } from '../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, RegistrationRequest, LoginRequest, UpdateUserRequest } from '../types';

const saltRounds = 10;
const secret = process.env.JWT_SECRET || '12345';

// register user
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, firstName, lastName, phoneNumber }: RegistrationRequest = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query<User>(
      'INSERT INTO users (username, email, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, first_name, last_name, phone_number',
      [username, email, hashedPassword, firstName, lastName, phoneNumber]
    );
    const newUser = result.rows[0];
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;
  try {
    const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout successful' });
};


   // get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query<User>('SELECT id, username, email, first_name, last_name, phone_number FROM users');
    const users = result.rows;
    // console.log(`Fetched users: ${JSON.stringify(users)}`);
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: 'No users found' });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// get user by id
export const getUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  console.log(`Fetching user with ID: ${userId}`);
  try {
    const result = await pool.query<User>('SELECT id, username, email, first_name, last_name, phone_number FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    // console.log(`User found: ${JSON.stringify(user)}`);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// update user by id
export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { username, email, firstName, lastName, phoneNumber }: UpdateUserRequest = req.body;
  try {
    const result = await pool.query<User>(
      'UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4, phone_number = $5 WHERE id = $6 RETURNING id, username, email, first_name, last_name, phone_number',
      [username, email, firstName, lastName, phoneNumber, userId]
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

// delete user by id
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const result = await pool.query<User>('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
    const deletedUser = result.rows[0];
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
