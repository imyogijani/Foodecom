import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv with absolute path
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug logging
console.log('MONGO_URL:', process.env.MONGO_URL);

import connectDB from "./config/db.js";
//mongodb Connection
connectDB();

// rest object
const app = express();

//middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(morgan("dev"));

// File Upload Middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
}));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

//routs
//1 test route
// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Welcome to LifeConnect",
//   });
// });
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/admin", adminRoutes);

// app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));

// to see sever is proper running
// http://localhost:8080/
// http://localhost:5173/
//add port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Node server running in ${process.env.DEV_MODE} mode on Port ${process.env.PORT}`
      .bgBlue.white
  );
});
