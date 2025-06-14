import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["admin", "shopowner", "client"],
    },
    avatar: {
      type: String,
      default: null,
    },
    names: {
      type: String,
      required: function () {
        if (this.role === "client" || this.role === "admin") {
          return true;
        }
        return false;
      },
    },
    shopownerName: {
      type: String,
      required: function () {
        if (this.role === "shopowner") {
          return true;
        }
        return false;
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],

    },
    address: {
      type: String,
      required: function () {
        return this.role === "Client" || this.role === "shopowner";
      },
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
    },
    avatar: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);
export default userModel;
