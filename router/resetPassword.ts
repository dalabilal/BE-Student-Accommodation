import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Users from '../models/userLogin';
import Logs from '../models/logsfile';
import User from '../models/user';

const router = express.Router();

router.put('/',async (req : Request, res : Response) => {
    const { email, newPassword, confirmNewPassword } = req.body;
  
    if (!email || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
  
    const user = User.findOne(email);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await User.updateOne({email : email} , {password : hashedPassword})
    console.log("user" , user);
    

   let userLogs = new Logs({
    userID: "sdfs",
    date: new Date(),
    name: email,
    actionType:"Reset Password",
 });

  await userLogs.save();

    res.status(200).json({ message: 'Password reset successful' });
  });

  
export default router;