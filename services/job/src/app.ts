import express from "express"
import dotenv from "dotenv"

import jobRoutes from "./routes/index.js"

const app= express();
dotenv.config();

app.use(express.json())
app.use("/api/job", jobRoutes);

app.listen(process.env.PORT,()=>{
    console.log("JOB SERVICE RUNNING ",process.env.PORT);
    
})