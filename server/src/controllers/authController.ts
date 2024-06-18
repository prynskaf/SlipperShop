// import { Request, Response } from 'express';
// import { pool } from '../index';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { User } from '../types';

// const saltRounds = 10;
// const secret = 'your_jwt_secret';

// interface RegistrationRequest {
//   username: string;
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
// }

// interface LoginRequest {
//   email: string;
//   password: string;
// }

// export const registerUser = async (req: Request, res: Response) => {
//   const { username, email, password, firstName, lastName, phoneNumber }: RegistrationRequest = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     const result = await pool.query<User>(
//       'INSERT INTO users (username, email, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, first_name, last_name, phone_number',
//       [username, email, hashedPassword, firstName, lastName, phoneNumber]
//     );
//     const newUser = result.rows[0];
//     res.status(201).json(newUser);
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const loginUser = async (req: Request, res: Response) => {
//   const { email, password }: LoginRequest = req.body;
//   try {
//     const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
//     const user = result.rows[0];
//     if (user) {
//       const passwordMatch = await bcrypt.compare(password, user.password);
//       if (passwordMatch) {
//         const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
//         res.status(200).json({ message: 'Login successful', token });
//       } else {
//         res.status(401).json({ error: 'Invalid email or password' });
//       }
//     } else {
//       res.status(401).json({ error: 'Invalid email or password' });
//     }
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const logoutUser = async (req: Request, res: Response) => {
//   // Handle user logout logic here
//   res.status(200).json({ message: 'Logout successful' });
// };
