import express, { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';

// ... (other imports)

const router = express.Router();

// POST route for user sign-up
router.post('/', async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, confirmPassword, phoneNumber, role } = req.body;
  try {
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return res.status(400).json({ error: { message: 'Passwords do not match' } });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('Email already exists');
      return res.status(400).json({ error: { message: 'Email already exists' } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user in the database
    const newUser = new User({ firstname, lastname, email, password: hashedPassword, phoneNumber, role });

    await newUser.save();

    // Send a success response
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error: any) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: { message: 'Error creating user', details: error.message } });
  }
});

export default router;
