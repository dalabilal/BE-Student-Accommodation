import express, { Request, Response } from 'express';
import Payment from '../models/payInfo';
import Logs from '../models/logsfile';
import Users from '../models/userLogin';

const router = express.Router();

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
    const user = await Users.findOne({ userID : newPayment?.useid });

    let userLogs = new Logs({
      userID: newPayment.useid,
      date: new Date(),
      name: user?.email,
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
