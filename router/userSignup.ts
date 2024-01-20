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
      console.log('Passwords do not match');
      return res.status(400).json({ error: { message: 'Passwords do not match' } });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('Email already exists');
      return res.status(400).json({ error: { message: 'Email already exists' } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ firstname, lastname, email, password: hashedPassword, phoneNumber, role });

    await newUser.save();
    const JWT_EXPIRATION_NUM : any =  process.env.JWT_EXPIRATION_NUM;
    const NODE_ENV : any =  process.env.NODE_ENV;
    
    const token = jwt.sign(
      {
        userId: newUser._id,
      },
       process.env.JWT_SECRET || "dAlAiStHeBeSt",
    );
    // Send back the user's firstname and token in the response
    const secureCookie : boolean = true;
    const httpOnlyCookie : boolean = true;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    const cookieOptions: cookie.CookieSerializeOptions  = {
      secure: secureCookie,
      httpOnly: httpOnlyCookie,
      expires: expirationDate,
    };

// Set the cookie in the response header using res.cookie
const cookieString = cookie.serialize('jwtToken', token, cookieOptions);
res.setHeader('Set-Cookie', cookieString);
   res.cookie('jwtToken', token, cookieOptions);
    res.status(201).json({
      message: 'User created successfully',
      firstname: newUser.firstname,
      token,
    });
  } catch (error : any) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: { message: 'Error creating user', details: error.message } });
  }
});

export default router;
