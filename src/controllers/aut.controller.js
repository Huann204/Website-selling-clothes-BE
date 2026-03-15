const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const bcrypt = require("bcrypt");
// Đăng ký admin
exports.registerAdmin = async (req, res) => {
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
};

// Đăng nhập admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Email không tồn tại" });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    const accessToken = jwt.sign(
      { id: admin._id, role: admin.role },
      JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );
    if (!admin.active)
      return res
        .status(403)
        .json({ message: "Tài khoản chưa được duyệt, liên hệ superadmin" });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 phút
    });
    res.json({ message: "Đăng nhập thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//đăng xuất admin
exports.logoutAdmin = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({ message: "Đăng xuất thành công" });
};

exports.infoAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    res.json({
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
