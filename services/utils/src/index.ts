import express from "express"
import dotenv from "dotenv"
import routes from "./routes.js"
import { v2 as cloudinary } from "cloudinary";
const app =express();
import cors from "cors"
import { startSendMailConsumer } from "./consumer.js";
dotenv.config();


startSendMailConsumer();



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});



app.use(cors());
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb',extended:true}))
app.use("/api/utils",routes)
app.listen(process.env.PORT,()=>{
    console.log("UTILS SERVICE RUNNING",process.env.PORT);
    
})