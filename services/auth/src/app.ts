import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import { connectKafka } from "./producer.js";

const app = express();

// debug middleware: log request origin, method, path and cookie header to help diagnose CORS/cookie issues
app.use((req, res, next) => {
	console.log(`Incoming request: ${req.method} ${req.path} - Origin: ${req.headers.origin} - Cookie: ${req.headers.cookie}`);
	next();
});

// Allow requests from the frontend during development. Set FRONTEND_URL in .env for production.
const frontendOrigin = process.env.FRONTEND_URL || process.env.Frontend_Url || "http://localhost:3000";
// allow Authorization header for bearer token requests coming from the browser (preflight)
app.use(cors({ origin: frontendOrigin, credentials: true, allowedHeaders: ['Content-Type','Authorization'], methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));
// explicit headers and quick OPTIONS response for preflight requests
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', frontendOrigin);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Credentials', 'true');
	if (req.method === 'OPTIONS') return res.sendStatus(200);
	next();
});

app.use(express.json());
// parse cookies for refresh token handling
app.use(cookieParser());
app.use("/api/auth", authRoutes);

connectKafka();

export default app;