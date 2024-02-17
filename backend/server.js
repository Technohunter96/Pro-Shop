import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
const port = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB with Mongoose query

const app = express();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes); // any request to /api/products will be handled by productRoutes

app.use(notFound); // 404 error handler
app.use(errorHandler); // 500 error handler

app.listen(port, () => console.log(`Server running on port ${port}`));
