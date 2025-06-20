/* eslint-disable no-undef */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import userModel from "../models/userModel.js";
import Subscription from "../models/subscriptionModel.js"; // Changed to default import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//registration
const registerController = async (req, res) => {
  try {
    const { email, password, role, subscriptionId, shopName, ...rest } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userData = {
      email,
      password: hashedPassword,
      role,
      ...rest,
    };

    if (role === "shopowner" && subscriptionId) {
      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) {
        return res.status(400).send({
          success: false,
          message: "Invalid subscription plan provided",
        });
      }
      userData.subscription = subscriptionId;
      userData.subscriptionStartDate = new Date();
      userData.shopName = shopName; // Add shopName for shopowner
      userData.subscriptionFeatures = subscription.includedFeatures; // Store features at registration
    }

    const user = new userModel(userData);
    await user.save();

    return res.status(201).send({
      success: true,
      message: "User registered successfully 🎉",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in register API",
      error,
    });
  }
};

//login call back
const loginController = async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.body.email })
      .populate("subscription");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check subscription status for shopowners
    if (user.role === "shopowner" && user.subscription) {
      const oneMonth = 30 * 24 * 60 * 60 * 1000; // milliseconds in a month
      const now = new Date();
      const subscriptionEndDate = new Date(
        user.subscriptionStartDate.getTime() + oneMonth
      );

      if (now > subscriptionEndDate) {
        return res.status(403).send({
          success: false,
          message: "Your subscription has expired. Please renew to continue.",
        });
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).send({
      success: true,
      message: "Login successful 🎉",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login 🥲",
      error,
    });
  }
};

//current user controller
const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    return res.status(200).send({
      success: true,
      message: "User Fetched successfully🎉",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Unable to get current user😌",
      error,
    });
  }
};

// Update profile controller
const updateProfileController = async (req, res) => {
  try {
    const { names, shopownerName, email, phone, address } = req.body;
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields based on role
    if (user.role === "shopowner") {
      user.shopownerName = shopownerName || user.shopownerName;
    } else if (user.role === "client" || user.role === "admin") {
      user.names = names || user.names;
    }

    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Upload avatar controller
const uploadAvatarController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "No image file provided",
      });
    }

    // Validate file type
    if (!req.file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
      // Clean up invalid file
      fs.unlinkSync(req.file.path);
      return res.status(400).send({
        success: false,
        message: "Invalid file type. Only JPG, PNG and GIF files are allowed.",
      });
    }

    const user = await userModel.findById(req.userId);
    if (!user) {
      // Clean up file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Create the URL for the uploaded avatar
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Remove old avatar file if it exists
    if (user.avatar) {
      try {
        const oldAvatarPath = path.join(__dirname, "..", "public", user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      } catch (err) {
        console.error("Error removing old avatar:", err);
        // Continue with the update even if old file cleanup fails
      }
    }

    user.avatar = avatarUrl;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Avatar uploaded successfully",
      avatarUrl,
      user,
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Error cleaning up file on error:", err);
      }
    }

    console.error("Avatar upload error:", error);
    return res.status(500).send({
      success: false,
      message: "Error uploading avatar. Please try again.",
      error: error.message,
    });
  }
};

//verify token
export const verifyToken = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in token verification",
      error,
    });
  }
};

// Clear notification for shopowner
export const clearNotification = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.notification = null;
    await user.save();
    res.json({ success: true, message: "Notification cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error clearing notification", error: error.message });
  }
};

export {
  registerController,
  loginController,
  currentUserController,
  updateProfileController,
  uploadAvatarController,
};
