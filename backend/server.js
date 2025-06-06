import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

//dot config
// dotenv.config({path: ""})
dotenv.config();

import connectDB from "./config/db.js";
//mongodb Connection
connectDB();

// rest object
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
//routs
//1 test route
// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Welcome to LifeConnect",
//   });
// });
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
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
