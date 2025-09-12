import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import cors from 'cors'; // Add this line at the top with your other imports


import Path from 'path';
import { fileURLToPath } from 'url';

import cartRouter from './routes/cartRoute.js';
import userRouter from './routes/userRoute.js';
import itemRouter from './routes/itemRoute.js';
import orderRouter from './routes/orderRoute.js';
import contactRouter from './routes/contactRoute.js';

const app = express();
const port = process.env.PORT || 4000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);



app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();


app.use('/api/user',userRouter)
app.use('/uploads', express.static(Path.join(__dirname, 'uploads')));
app.use('/api/items', itemRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/contact', contactRouter);

app.get('/', (req, res) => {
  res.send('API WORKING');
});

app.listen(port, () => {
  console.log(`✅ Server Started on http://localhost:${port}`);
});
