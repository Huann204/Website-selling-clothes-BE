const express = require("express");
const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");

const router = express.Router();

// Register admin
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await Admin.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email đã tồn tại" });

    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    res.json({ message: "Đăng ký thành công, chờ superadmin duyệt" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    if (!admin.active)
      return res.status(403).json({ message: "Tài khoản chưa được duyệt" });
    if (admin.active === false)
      return res.status(403).json({ message: "Tài khoản chưa được duyệt" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
