import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Users from '../models/userLogin';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Send back the user object with the role upon successful login
      res.status(200).json({ ...user.toObject(), password: undefined });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

export default router;
