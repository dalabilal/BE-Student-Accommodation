import express, { Request, Response } from 'express';
import User from '../models/user'; // Adjust the path as needed
import bycypt from 'bcrypt'

const router = express.Router();

// POST route for user sign-up
console.log("sfsdfgds")
router.post('/', async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, phoneNumber } = req.body;

  try {
    const hashpassword = await bycypt.hash(password,10)
    // Create a new user in the database
    const newUser = new User({ firstname, lastname, email, password : hashpassword, phoneNumber });
    await newUser.save();

    // Send a success response
    res.status(201).json(newUser);
  } catch (error: any) {
    // Define the error object as type 'any' here
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

export default router;
