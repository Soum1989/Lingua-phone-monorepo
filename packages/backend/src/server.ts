import * as path from "path";
import * as dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api';

// Resolve .env path - look in the root directory
const envPath = path.resolve(__dirname, "../../../.env");
console.log("Loading env file from:", envPath);

// Load environment variables
dotenv.config({ path: envPath });

// Debug check
console.log("Gemini Key Loaded?", !!process.env.GEMINI_API_KEY);
if (process.env.GEMINI_API_KEY) {
  console.log("Gemini Key Length:", process.env.GEMINI_API_KEY.length);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002; // Use 3002 as default
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Backend listening on http://${HOST}:${PORT}`);
});