const express = require("express");
const router = express.Router();
const test = require("../controllers/test.controller");

router.get("/", test.getAllTest);
router.post("/", test.createTest);
router.delete("/", test.deleteTest);

module.exports = router;
