const Admin = require("../models/admin.model");

// Lấy danh sách tất cả admins (chỉ superadmin mới có quyền)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo admin mới (chỉ superadmin)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exist = await Admin.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email đã tồn tại" });
    const newAdmin = new Admin({
      name,
      email,
      password,
      role: role || "admin",
      active: true, // superadmin tạo thì mặc định đã duyệt
    });
    await newAdmin.save();
    res.status(201).json({ message: "Tạo admin thành công", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật admin (name, email, password, role, active/approved)
exports.updateAdmin = async (req, res) => {
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
    res.json({ message: "Cập nhật admin thành công", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xoá admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin)
      return res.status(404).json({ message: "Không tìm thấy admin" });
    await admin.remove();
    res.json({ message: "Xoá admin thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
