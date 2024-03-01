import path from "path"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
import connectDB from "./config/db.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
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
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)

// PayPal client id config that is sent to the frontend for use in the PayPal button component in the OrderScreen
app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
)

const __dirname = path.resolve() // __dirname is not available in ES6 modules, so we use this line to get the current directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads"))) // Serve the uploads folder statically

// Error middleware
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))
