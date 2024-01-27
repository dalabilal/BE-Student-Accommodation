import express, { Request, Response } from 'express';
import  Stripe  from 'stripe';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe('your_stripe_secret_key', {
  apiVersion: '2023-10-16',
});

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  console.log('Get Response from Researcher');
  res.status(200).json({
    message: 'it works',
  });
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { token, amount } = req.body;
    const idempotencyKey = uuidv4();

    // Create a paymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert amount to cents
      currency: 'usd',
      payment_method: token,
      confirmation_method: 'manual',
      confirm: true,
      receipt_email: 'customer@example.com',
    });

    // Handle successful payment
    res.status(200).json({ message: 'Payment successful', paymentIntent });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
