import express, { Request, Response  } from 'express';
import Term from '../models/termInfo';

const router = express.Router();

router.post('/', async (req : Request, res : Response) => {
  try {
    const fees = req.body.fees;
    const term = req.body.term;
    const housingId = req.body.housingId;
    const ownerId = req.body.ownerId;

    const Terms = {
      fees,
      term,
      housingId,
      ownerId,
    }
    const newTerms = new Term(Terms);
    const savedTerms = await newTerms.save();
    res.status(201).json(savedTerms);
  } catch (error) {
    console.error("error",error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
