const express = require("express");
const autController = require("../controllers/aut.controller");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
// Đăng ký admin
router.post("/register", autController.registerAdmin);

// Đăng nhập admin
router.post("/login", autController.loginAdmin);

// Đăng xuất admin
router.post("/logout", autController.logoutAdmin);
// Lấy thông tin admin
router.get("/info", authMiddleware(), autController.infoAdmin);
module.exports = router;
