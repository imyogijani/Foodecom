// const express = require("express");
import express from "express";
import { testController } from "../controllers/testController.js";
// const { testController } = require("../controllers/testController");


//router object
const router = express.Router();

//routes
router.get("/", testController);

// module.exports = router;
export default router;
