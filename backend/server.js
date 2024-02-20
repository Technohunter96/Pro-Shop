import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
import connectDB from "./config/db.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
const port = process.env.PORT || 5000

connectDB() // Connect to MongoDB with Mongoose query

const app = express()

// Body parser middleware - allow us to get body data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie parser middleware
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("API is running...")
})

app.use("/api/products", productRoutes) // any request to /api/products will be handled by productRoutes

app.use("/api/users", userRoutes)

// Error middleware
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))
