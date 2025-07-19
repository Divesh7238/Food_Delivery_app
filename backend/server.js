import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';


import Path from 'path';
import { fileURLToPath } from 'url';

import cartRouter from './routes/cartRoute.js';
import userRouter from './routes/userRoute.js';
import itemRouter from './routes/itemRoute.js';

const app = express();
const port = process.env.PORT || 4000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);



app.use(cors({
    origin: (origin, callback) =>{
        const allowedOrigins = ['http://localhost:5173/','http://localhost:5174/'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy violation: Origin not allowed'));
        }
    },
    credentials: true,

    }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();


app.use('/api/user',userRouter)
app.use('/uplpads',express.static(Path.join(__dirname,'uploads')));
app.use('/api/items', itemRouter);
app.use('api/cart', cartRouter);


app.get('/', (req, res) => {
  res.send('API WORKING');
});

app.listen(port, () => {
  console.log(`✅ Server Started on http://localhost:${port}`);
});
