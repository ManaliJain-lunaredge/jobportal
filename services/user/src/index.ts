import express from "express"

import dotenv from "dotenv"
const app=express();
import userRoutes from "./routes/user.js"
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(process.env.PORT, () => {
  console.log(`User service working on port ${process.env.PORT}`);
});

app.use("/api/user",userRoutes);