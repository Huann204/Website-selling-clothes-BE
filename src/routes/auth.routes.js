const express = require("express");
const autController = require("../controllers/aut.controller");
const router = express.Router();

// Đăng ký admin
router.post("/register", autController.registerAdmin);

// Đăng nhập admin
router.post("/login", autController.loginAdmin);

module.exports = router;
