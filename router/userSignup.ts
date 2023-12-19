import express, { Request, Response } from 'express';
import User from '../models/user'; // Adjust the path as needed
import bcrypt from 'bcrypt';

const router = express.Router();

// POST route for user sign-up
router.post('/', async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, phoneNumber, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user in the database
    const newUser = new User({ firstname, lastname, email, password: hashedPassword, phoneNumber, role });
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error: any) {
    // Define the error object as type 'any' here
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

export default router;
