import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import * as cookie from 'cookie';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, confirmPassword, phoneNumber, role } = req.body;
   
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: { message: 'Passwords do not match' } });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: { message: 'Email already exists' } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
       firstname,
       lastname,
       email,
       password: hashedPassword,
       phoneNumber,
       role,
       status : 'pending'
    });

    await newUser.save();
    
    const token = jwt.sign(
      {
        userId: newUser._id,
      },
       process.env.JWT_SECRET || "dAlAiStHeBeSt",
    );

    const secureCookie : boolean = true;
    const httpOnlyCookie : boolean = true;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    const cookieOptions: cookie.CookieSerializeOptions  = {
      secure: secureCookie,
      httpOnly: httpOnlyCookie,
      expires: expirationDate,
    };


const cookieString = cookie.serialize('jwtToken', token, cookieOptions);
res.setHeader('Set-Cookie', cookieString);
   res.cookie('jwtToken', token, cookieOptions);
    res.status(201).json({
      message: 'User created successfully',
      firstname: newUser.firstname,
      _id : newUser._id,
      token,
    });
  } catch (error : any) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: { message: 'Error creating user', details: error.message } });
  }
});

export default router;
