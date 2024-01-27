import express, { Request, Response  } from 'express';
import Users from '../models/userLogin';

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, verificationCode } = req.body;
     console.log("body" , req.body);
     
    try {
      const user = await Users.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.verificationCode === verificationCode) {
        
        console.log(user.verificationCode , verificationCode);
        
        user.verificationCode = null;
        await user.save();
  
        return res.status(200).json({ message: 'Verification successful' });
      } else {
       
        return res.status(401).json({ message: 'Invalid verification code' });
      }
    } catch (error) {
      console.error('Error during verification:', error);
      res.status(500).json({ message: 'Error during verification' });
    }
  });
  
  export default router;