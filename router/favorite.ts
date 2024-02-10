import express, { Request, Response  } from 'express';
import Favorite from '../models/favorite'
import Logs from '../models/logsfile';
import Users from '../models/userLogin';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { userID, dataId, name, description ,image } = req.body;

    const existingLike = await Favorite.findOne({ userID, dataId });

    if (!existingLike) {
      const newLike = new Favorite({ userID, dataId, name, description ,image});
      await newLike.save();

      let userLogs = new Logs({
        userID: newLike.userID,
        date: new Date(),
        name: newLike.name,
        actionType:"Add To favorite",
     });
  
      await userLogs.save();

      return res.status(201).json({ message: 'Like saved successfully' });
    }

    return res.status(400).json({ message: 'Like already exists' });
  } catch (error : any) {
    console.error('Error during like save:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:userID', async (req: Request, res: Response) => {
    try {
      const userID = req.params.userID;
  
      const likedData = await Favorite.find({ userID });
  
      res.status(200).json(likedData);
    } catch (error : any) {
      console.error('Error during fetch liked data:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.delete('/:dataId', async (req: Request, res: Response) => {
    try {
      const dataId = req.params.dataId;
      const housingToDelete = await Favorite.findById(dataId);
      await Favorite.findByIdAndDelete(housingToDelete);
      const user = await Users.findOne({userID: housingToDelete?.userID });

      let userLogs = new Logs({
        userID: housingToDelete?.userID || user?._id,
        date: new Date(),
        name: user?.email || "Not Found",
        actionType:"Delete Favorite Accommodation",
     });
  
      await userLogs.save();
      res.status(200).json({ message: 'Favorite item deleted successfully' });
    } catch (error: any) {
      console.error('Error during delete favorite item:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.delete('/clear/:userID', async (req: Request, res: Response) => {
    try {
      const userID = req.params.userID;
  
      await Favorite.deleteMany({ userID });
  
      res.status(200).json({ message: 'All favorite items cleared successfully' });
    } catch (error: any) {
      console.error('Error during clear all favorites:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default router;
