import express from "express";
const {
  registerController,
  loginController,
  currentuserConroller,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//route
//register || POST
router.post("/register", registerController);
//Login || POST
router.post("/login", loginController);
//get current user || GET
router.get("/current-user", authMiddleware, currentuserConroller);

export default router;
