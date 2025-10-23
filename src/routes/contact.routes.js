const express = require("express");
const router = express.Router();
const contact = require("../controllers/contact.controller");
const authAdminOrSuper = require("../middleware/authAdminOrSuper.middleware");

router.get("/", contact.getContactInfo);
router.put("/", authAdminOrSuper, contact.updateContactInfo);

module.exports = router;
