import express from "express"
import cors from "cors"

import dotenv from "dotenv"
const app = express();
import userRoutes from "./routes/user.js"
dotenv.config();

const frontendOrigin = process.env.FRONTEND_URL || process.env.Frontend_Url || "http://localhost:3000"
app.use(cors({ origin: frontendOrigin, credentials: true }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/user", userRoutes)

app.listen(process.env.PORT, () => {
  console.log(`User service working on port ${process.env.PORT}`)
})