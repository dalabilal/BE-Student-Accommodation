import express, { Request, Response } from 'express';
import crypto from 'crypto';
import Payment from '../models/payInfo';

const router = express.Router();

function encrypt(text: string): { iv: string; encryptedText: string; tag: string } {
  const iv = crypto.randomBytes(16).toString('hex');
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(process.env.ENCRYPTION_KEY || ''), Buffer.from(iv, 'hex'));
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return { iv, encryptedText: encrypted, tag };
}

function decrypt(iv: string, encryptedText: string, tag: string): string {
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(process.env.ENCRYPTION_KEY || ''), Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));

  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

router.post('/', async (req: Request, res: Response) => {
  
  try {
    const status = req.body.status;
    const useid: string = req.body.useid;
    const housingId: string = req.body.housingId;
    const ownerId: string = req.body.ownerId;

    const payment = {
      status,
      useid,
      housingId,
      ownerId
    }

    const newPayment = new Payment(payment);
    const savedPayment = await newPayment.save();
  
    res.status(201).json({ message: 'Payment successful', savedPayment });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/owner', async (req: Request, res: Response) => {


  try {
    const ownerEntry = await Payment.find();
   
    res.status(200).json(ownerEntry);
  } catch (error) {
    console.error('Error fetching owner entry by ID', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
