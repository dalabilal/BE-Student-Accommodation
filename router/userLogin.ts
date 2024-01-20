import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Users from '../models/userLogin';
import * as cookie from 'cookie';
import jwt from "jsonwebtoken";

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
      // Generate a JWT token upon successful login
      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET || "dAlAiStHeBeSt",
        { expiresIn: '1h' }
      );

      // Set the cookie in the response header using res.cookie
      const secureCookie: boolean = true;
      const httpOnlyCookie: boolean = true;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      const cookieOptions: cookie.CookieSerializeOptions = {
        secure: secureCookie,
        httpOnly: httpOnlyCookie,
        expires: expirationDate,
      };

      // Set the cookie in the response header
      const cookieString = cookie.serialize('jwtToken', token, cookieOptions);
      res.setHeader('Set-Cookie', cookieString);

      // Verify the token for additional handling or validation
      jwt.verify(token, process.env.JWT_SECRET || "dAlAiStHeBeSt", (err, decoded) => {
        if (err) {
          // Handle invalid or expired token
          return res.status(401).json({ error: 'Invalid or expired token' });
        }

     
        // Additional logic or response handling based on the verification result
        res.status(200).json({ ...user.toObject(), password: undefined, token });
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

export default router;
