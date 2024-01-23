import express, { Request, Response  } from 'express';
import Housing from '../models/ownerInfo';

const router = express.Router();

// Route to add housing data
router.post('/', async (req : Request, res : Response) => {
  try {
    console.log("im here" ,req.body )
    const newHousing = new Housing(req.body);
    const savedHousing = await newHousing.save();
    res.status(201).json(savedHousing);
  } catch (error) {
    console.error("error",error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
