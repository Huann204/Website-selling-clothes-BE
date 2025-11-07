const express = require("express");
const router = express.Router();
const payController = require("../controllers/pay.controller");

router.post("/", payController.createPaymentUrl);
router.get("/return", payController.handleReturn);

module.exports = router;
