import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './infrastructure/database/connection';
import ticketRoutes from './presentation/routes/ticketRoutes';
import authRoutes from './presentation/routes/authRoutes';
import userRoutes from './presentation/routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Ticket System API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);

const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`[Server]: Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('[Server]: Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
