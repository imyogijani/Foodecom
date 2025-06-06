import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/foodecom", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.use("/api", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});