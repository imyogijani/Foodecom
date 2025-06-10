// const mongoose = require("mongoose");
import mongoose from "mongoose";
import colors from "colors";
// const colors = require("colors");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected To Mongodb Database ${mongoose.connection.host}`.bgMagenta
        .white
    );
  } catch (error) {
    console.log(`Mongodb Databse Error ${error}`.bgRed.white);
    process.exit(1); // optional: exit process on DB connection failure
  }
};
export default connectDB;
// module.exports = connectDB;
