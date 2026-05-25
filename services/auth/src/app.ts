import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { connectKafka } from "./producer.js";

const app = express();

// Allow requests from the frontend during development. Set FRONTEND_URL in .env for production.
const frontendOrigin = process.env.FRONTEND_URL || process.env.Frontend_Url || "http://localhost:3000";
app.use(cors({ origin: frontendOrigin, credentials: true }));

app.use(express.json());
app.use("/api/auth", authRoutes);

connectKafka();

export default app;