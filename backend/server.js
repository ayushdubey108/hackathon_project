import express, { json } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import analyzeRoutes from './routes/analyzeRoutes.js';



const app = express();
const PORT = process.env.PORT || 3000;
console.log("ENV CHECK:", process.env.GEMINI_API_KEY);
app.use(cors(
  {origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
));
app.use(json());

// Routes
app.use('/api/analyze', analyzeRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
