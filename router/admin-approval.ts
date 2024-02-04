// admin.route.js
import express, { Request, Response } from 'express';
import User from '../models/user';

const router = express.Router();

// Admin approval route for selected users
router.post('/approve-users', async (req: Request, res: Response) => {
  const { userIds } = req.body;

  try {
    // Update the status of selected users to 'approved'
    await User.updateMany({ _id: { $in: userIds } }, { status: 'approved' });

    return res.status(200).json({ message: 'Users approved successfully' });
  } catch (error : any) {
    console.error('Error approving users:', error.message);
    return res.status(500).json({ error: { message: 'Internal server error' } });
  }
});

// Admin route to fetch all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find(); // Exclude password field from the response
    return res.status(200).json({ users });
  } catch (error : any) {
    console.error('Error fetching users:', error.message);
    return res.status(500).json({ error: { message: 'Internal server error' } });
  }
});

export default router;
