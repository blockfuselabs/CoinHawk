import express from "express";
import cors from "cors";
import coinRoutes from "./routes/coin.route";

const app = express();

// Enable CORS for Tauri and web development
app.use(cors({
  origin: [
    'http://localhost:1420',    // Your Tauri dev server
    'http://localhost:3000',    // React dev server
    'http://localhost:5173',    // Vite dev server
    'tauri://localhost',        // Tauri app origin
    'https://tauri.localhost',  // Alternative Tauri origin
    'http://127.0.0.1:1420',   // IPv4 localhost
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-requested-with',
    'Access-Control-Allow-Origin'
  ],
}));

// Handle preflight requests
app.options('*', cors());

// JSON middleware
app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'CoinView Backend is healthy 🚀',
    cors: 'enabled-for-tauri'
  });
});

// API routes
app.use("/api/coins", coinRoutes);

// Root endpoint
app.get("/", (_req, res) => {
  res.send("CoinView Backend is running 🚀");
});

export default app;