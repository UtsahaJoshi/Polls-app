/* eslint-disable prettier/prettier */
const express = require("express");
const authController = require("../controllers/authcontroller");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetpassword/:token", authController.resetPassword);

router.get("/", userController.getAllUser);

module.exports = router;
