import express, { Request, Response } from 'express';
import Payment from '../models/payInfo';
import Logs from '../models/logsfile';
import crypto from 'crypto';
import User from '../models/user';

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
    const holdername: string = req.body.holdername;

    const { iv: cardnumIV, encryptedText: cardnum, tag: cardnumTag } = encrypt(req.body.cardnum);
    const { iv: cvvIV, encryptedText: cvv, tag: cvvTag } = encrypt(req.body.cvv);
    const expDate: string = req.body.expDate;
    const useid: string = req.body.useid;
    const housingId: string = req.body.housingId;
    const ownerId: string = req.body.ownerId;

    const payment = {
      holdername,
      cardnum: { iv: cardnumIV, encryptedText: cardnum, tag: cardnumTag },
      cvv: { iv: cvvIV, encryptedText: cvv, tag: cvvTag },
      expDate,
      useid,
      housingId,
      ownerId
    }
    const newPayment = new Payment(payment);
    const savedPayment = await newPayment.save();
    const user = await User.findOne({ _id : newPayment?.useid });

    let userLogs = new Logs({
      userID: newPayment.useid,
      date: new Date(),
      name: user?.email || "Not Found",
      actionType:"Booking",
   });

    await userLogs.save();
    res.status(201).json({ message: 'Payment successful', savedPayment });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/google', async (req: Request, res: Response) => {
  
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
    const user = await User.findOne({ _id : newPayment?.useid });

    let userLogs = new Logs({
      userID: newPayment.useid,
      date: new Date(),
      name: user?.email || "Not Found",
      actionType:"Booking",
   });

    await userLogs.save();
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
