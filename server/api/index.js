// Vercel serverless entry point
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import blogRoutes from '../routes/blog.js';
import authRoutes from '../routes/auth.js';
import reservationRoutes from '../routes/reservations.js';
import productRoutes from '../routes/products-vercel.js';

// Cache MongoDB connection across serverless invocations
let cachedDb = null;
async function connectDB() {
  if (cachedDb) return cachedDb;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bruno-pesenti';
  cachedDb = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  return cachedDb;
}

const app = express();

// Middleware to ensure DB is connected before API calls
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await connectDB();
    } catch (e) {
      console.error('DB connection failed:', e.message);
    }
  }
  next();
});

app.use(cors({
  origin: ['https://www.brunopesenti.ch', 'https://brunopesenti.ch', 'https://api.brunopesenti.ch'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/blog', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Vercel serverless is running' });
});

export default app;
