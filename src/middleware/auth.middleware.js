const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");

function auth(requiredRole) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Không có token" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Không có quyền truy cập" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  };
}

module.exports = auth;
