const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
function authAdminOrSuper(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Không có token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;

    // chỉ cho phép admin hoặc superadmin
    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}

module.exports = authAdminOrSuper;
