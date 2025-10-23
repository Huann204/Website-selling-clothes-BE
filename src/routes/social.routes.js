const express = require("express");
const router = express.Router();
const social = require("../controllers/social.controller");
const authAdminOrSuper = require("../middleware/authAdminOrSuper.middleware");

router.get("/", social.getSocialLinks);
router.put("/", authAdminOrSuper, social.updateSocialLinks);

module.exports = router;
