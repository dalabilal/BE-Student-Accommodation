// logoutRouter.js

import express from 'express';
import * as cookie from 'cookie';

const logoutRouter = express.Router();

logoutRouter.post('/', async (req, res) => {
  try {
    // Clear cookies or tokens
    res.clearCookie('jwtToken');

    // Send a response indicating successful logout
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default logoutRouter;
