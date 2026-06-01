import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import jobRoutes from "./routes/index.js"

const app= express();
dotenv.config();

const frontendOrigin = process.env.FRONTEND_URL || process.env.Frontend_Url || "http://localhost:3000";
// Echo the requesting Origin back in Access-Control-Allow-Origin to avoid mismatches
// (useful in dev where the frontend might be served from 127.0.0.1 or localhost).
app.use(cors({ origin: true, credentials: true, allowedHeaders: ['Content-Type','Authorization'], methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));
app.options('*', cors({ origin: true, credentials: true, allowedHeaders: ['Content-Type','Authorization'], methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));

// explicit CORS headers middleware (redundant with cors(), but ensures headers present)
app.use((req, res, next) => {
  const origin = req.headers.origin || frontendOrigin;
  res.header('Access-Control-Allow-Origin', origin as string);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/job", jobRoutes);

const port = process.env.PORT || 5003
app.listen(port,()=>{
    console.log("JOB SERVICE RUNNING ",port);
})