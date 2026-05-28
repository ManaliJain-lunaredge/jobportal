import express from "express"
import dotenv from "dotenv"
import routes from "./routes.js"
import { v2 as cloudinary } from "cloudinary";

import cors from "cors"
import { startSendMailConsumer } from "./consumer.js";



const app =express();
dotenv.config();
const frontendOrigin = process.env.FRONTEND_URL || process.env.Frontend_Url || "http://localhost:3000"
// Configure CORS globally. express's CORS middleware handles preflight OPTIONS requests,
// so an explicit app.options(...) call is unnecessary and can break older router/path-to-regexp versions.
app.use(cors({ origin: frontendOrigin, credentials: true, allowedHeaders: ['Content-Type','Authorization'], methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));


startSendMailConsumer();



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


app.use(express.json({limit:'100mb'}))
app.use(express.urlencoded({limit:'100mb',extended:true}))
app.use("/api/utils",routes)
const port = process.env.PORT || 5001
app.listen(port,()=>{
  console.log("UTILS SERVICE RUNNING",port);
    
})