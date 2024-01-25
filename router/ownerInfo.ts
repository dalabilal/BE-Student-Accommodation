import express, { Request, Response  } from 'express';
import Housing from '../models/ownerInfo';

const router = express.Router();

// Route to add housing data
router.post('/', async (req : Request, res : Response) => {
  try {
    console.log("im here" ,req.body )
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const location = req.body.location;
    const university = req.body.university;
    const rooms = req.body.rooms;
    const description =req.body.description;
    // const files = req.file.filename;
    const Housingo = {
      name,
      phoneNumber,
      location,
      university,
      rooms,
      description,
      // files
    }
    const newHousing = new Housing(Housingo);
    const savedHousing = await newHousing.save();
    res.status(201).json(savedHousing);
  } catch (error) {
    console.error("error",error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
