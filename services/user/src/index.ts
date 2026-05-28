import express from "express"
import cors from "cors"

import dotenv from "dotenv"
const app = express();
import userRoutes from "./routes/user.js"
dotenv.config();

const frontendOrigin = process.env.FRONTEND_URL || process.env.Frontend_Url || "http://localhost:3000"
// Configure CORS globally. express's CORS middleware handles preflight OPTIONS requests,
// so an explicit app.options(...) call is unnecessary and can break older router/path-to-regexp versions.
app.use(cors({ origin: frontendOrigin, credentials: true, allowedHeaders: ['Content-Type','Authorization'], methods: ['GET','POST','PUT','DELETE','OPTIONS'] }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/user", userRoutes)

const port = process.env.PORT || 5002
app.listen(port, () => {
  console.log(`User service working on port ${port}`)
})