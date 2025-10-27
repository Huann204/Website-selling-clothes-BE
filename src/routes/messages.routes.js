const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messages.controller");
const authAdminOrSuper = require("../middleware/authAdminOrSuper.middleware");

router.get("/", authAdminOrSuper, messagesController.getAllMessages);
router.post("/", messagesController.createMessage);
router.patch("/:id", authAdminOrSuper, messagesController.updateMessageStatus);
router.delete("/:id", authAdminOrSuper, messagesController.deleteMessage);
module.exports = router;
