const express = require("express");
const router = express.Router();
const shipController = require("../controllers/ghnLocation");
const ghnController = require("../controllers/ghn.controller");

router.get("/provinces", shipController.getGHNProvinces);
router.post("/districts", shipController.getGHNDistricts);
router.post("/wards", shipController.getGHNWards);
router.post("/calc-fee", ghnController.calcGHNShippingFee);
router.post("/create-order", ghnController.createGHNOrder);

module.exports = router;
