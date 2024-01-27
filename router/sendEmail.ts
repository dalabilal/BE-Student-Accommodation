import express, { Request, Response  } from 'express';
import Users from '../models/userLogin';
import { sendVerificationCode } from './emailService';


const router = express.Router();

router.post('/', async (req : Request, res : Response) => {
    const { email } = req.body;
    const user : any = await Users.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
         else {const verificationCode = generateVerificationCode();
          user.verificationCode = verificationCode;
          await user?.save();
          sendVerificationCode(user?.email, verificationCode);
          res.status(200).json({message : 'verification code send '})}
    
})

function generateVerificationCode() {
    // Implement your logic to generate a verification code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
export default router;