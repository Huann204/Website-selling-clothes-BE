const express = require("express");
const auth = require("../middleware/auth.middleware");
const adminController = require("../controllers/admins.controller");
const router = express.Router();

router.get("/", auth("superadmin"), adminController.getAllAdmins);
router.post("/", auth("superadmin"), adminController.createAdmin);

router.patch("/:id", auth("superadmin"), adminController.updateAdmin);

router.delete("/:id", auth("superadmin"), adminController.deleteAdmin);

module.exports = router;
