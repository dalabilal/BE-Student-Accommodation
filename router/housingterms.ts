import express, { Request, Response  } from 'express';
import Term from '../models/termInfo';
import Users from '../models/userLogin';
import Logs from '../models/logsfile';

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
    const user = await Users.findOne({userID: newTerms.ownerId });
    
    let userLogs = new Logs({
      userID: newTerms.ownerId,
      date: new Date(),
      name: user?.email || "not found",
      actionType:"Add Accommodation terms",
   });

    await userLogs.save();
    res.status(201).json(savedTerms);
  } catch (error) {
    console.error("error",error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const housingId = req.params.id;

  try {
    const housingEntry = await Term.findOne({housingId});
    
    if (!housingEntry) {
      return res.status(404).json({ message: 'Housing entry not found' });
    }
   
    res.status(200).json(housingEntry);
  } catch (error) {
    console.error('Error fetching housing entry by ID', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
