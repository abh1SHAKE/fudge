import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import sweetRoutes from './routes/sweets.js';

import { errorHandler } from './middleware/errorHandler.js';

import { connectDB } from './config/database.js';

dotenv.config();
const app = express();

connectDB();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get("/slide", (req, res) => {
    res.json({ status: "OK", message: "do you slide on all your nights like this?" })
});

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

app.use(errorHandler);

app.all('*path', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 1417;

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;


