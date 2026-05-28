import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import jobRoutes from "./routes/index.js"

const app= express();
dotenv.config();

const frontendOrigin = process.env.FRONTEND_URL || process.env.Frontend_Url || "http://localhost:3000"
app.use(cors({ origin: frontendOrigin, credentials: true, allowedHeaders: ['Content-Type','Authorization'], methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));
app.options('*', cors({ origin: frontendOrigin, credentials: true, allowedHeaders: ['Content-Type','Authorization'], methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));

app.use(express.json())
app.use("/api/job", jobRoutes);

const port = process.env.PORT || 5003
app.listen(port,()=>{
    console.log("JOB SERVICE RUNNING ",port);
    
})