const express = require("express");
const Admin = require("../models/admin.model");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * GET /api/admin/admins
 * Lấy danh sách tất cả admins (chỉ superadmin mới có quyền)
 */
router.get("/", auth("superadmin"), async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/admin/admins
 * Tạo admin mới (chỉ superadmin)
 */
router.post("/", auth("superadmin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await Admin.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email đã tồn tại" });

    const newAdmin = new Admin({
      name,
      email,
      password,
      role: role || "admin",
      approved: true, // superadmin tạo thì mặc định đã duyệt
    });

    await newAdmin.save();
    res.json({ message: "Tạo admin thành công", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PATCH /api/admin/admins/:id
 * Cập nhật admin (name, email, password, role, active/approved)
 */
router.patch("/:id", auth("superadmin"), async (req, res) => {
  try {
    const updates = req.body;
    const admin = await Admin.findById(req.params.id);

    if (!admin)
      return res.status(404).json({ message: "Không tìm thấy admin" });

    // Nếu có password mới thì bcrypt sẽ tự hash ở pre("save")
    if (updates.password) {
      admin.password = updates.password;
      delete updates.password;
    }

    Object.assign(admin, updates);
    await admin.save();

    res.json({ message: "Cập nhật thành công", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE /api/admin/admins/:id
 * Xóa admin
 */
router.delete("/:id", auth("superadmin"), async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin)
      return res.status(404).json({ message: "Không tìm thấy admin" });

    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
