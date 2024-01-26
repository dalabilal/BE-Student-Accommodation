import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Users from '../models/userLogin';

const router = express.Router();

router.put('/',async (req : Request, res : Response) => {
    const { email, newPassword, confirmNewPassword } = req.body;
  
    if (!email || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
  
    const user = Users.findOne({email});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log("new" , newPassword);
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

   await Users.updateOne({email : email} , {password : hashedPassword})

    res.status(200).json({ message: 'Password reset successful' });
  });

  
export default router;