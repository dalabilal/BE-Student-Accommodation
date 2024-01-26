import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {verifyRoutes, userRoutes, usersRoutes,logoutRoutes, ownerRoutes } from './router';


dotenv.config();

const app: Express = express();
const port =  3005;

app.use(cors({
  origin:'http://localhost:3005',
  credentials :true,
}));
app.use(express.json());


// Use the user routes
app.use('/signup', userRoutes);
app.use('/signin', usersRoutes);
app.use('/logout', logoutRoutes); 
app.use('/all', ownerRoutes); 
app.use('/verify', verifyRoutes); 

app.get('/', (req, res) => {
  res.send('Your Server is working fine!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://127.0.0.1:${port}`);
  dbConnect();
});

const dbConnect = () => {
  console.log('connecting to db...');
  
  mongoose.connect(`mongodb://127.0.0.1:27017/student-housing`)
  .then(() => {
    console.log(`🤗 [server]: Connected to MongoDB`);
  })
  .catch((err) => {
    console.log(`🤨 [server]: Failed to connect to mongodb ${err}`);
  });
};