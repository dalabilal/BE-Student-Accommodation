import express, { Request, Response  } from 'express';
import Housing from '../models/ownerInfo';
import Logs from '../models/logsfile';
import User from '../models/user';

const router = express.Router();

router.post('/', async (req : Request, res : Response) => {
  try {
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const location = req.body.location;
    const university = req.body.university;
    const rooms = req.body.rooms;
    const description =req.body.description;
    const ownerId = req.body.ownerId;
    const image = req.body.image;
    const username = req.body.username;

    const Housingo = {
      name,
      phoneNumber, 
      location,
      university, 
      rooms,
      description,
      ownerId,
      image,
      username
    }
    const newHousing = new Housing(Housingo);
    const savedHousing = await newHousing.save();

    const user = await User.findOne({ _id : newHousing.ownerId})

    let userLogs = new Logs({
      userID: newHousing.ownerId,
      date: new Date(),
      name: user?.email,
      actionType:"Add Acommodation",
   });

    await userLogs.save();

    res.status(201).json(savedHousing);
  } catch (error) {
    console.error("error",error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/housing/:id', async (req: Request, res: Response) => {
  const housingId = req.params.id;

  try {
    const housingEntry = await Housing.findById(housingId);
    if (!housingEntry) {
      return res.status(404).json({ message: 'Housing entry not found' });
    }

    res.status(200).json(housingEntry);
  } catch (error) {
    console.error('Error fetching housing entry by ID', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/housing', async (req: Request, res: Response) => {
  try {
    const housingData = await Housing.find();
    res.status(200).json(housingData);
  } catch (error) {
    console.error('Error fetching housing data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/housing/:id', async (req: Request, res: Response) => {
  const housingId = req.params.id;

  try {
    // Check if the housing ID exists
    const housingToDelete = await Housing.findById(housingId);
    if (!housingToDelete) {
      return res.status(404).json({ message: 'Housing not found' });
    }
    const user = await User.findOne({ _id : housingToDelete.ownerId});


    let userLogs = new Logs({
      userID: housingToDelete.ownerId,
      date: new Date(),
      name: user?.email ||"",
      actionType:"Delete Acommodation",
   });

    await userLogs.save();
    // Perform the deletion
    await Housing.findByIdAndDelete(housingId);
    
    res.status(200).json({ message: 'Housing deleted successfully' });
  } catch (error) {
    console.error('Error deleting housing data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
