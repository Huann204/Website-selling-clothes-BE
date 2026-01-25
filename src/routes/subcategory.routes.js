const express = require("express");
const subcategoryController = require("../controllers/subcategory.controller");
const router = express.Router();

router.get("/", subcategoryController.getAllSubcategories);
router.post("/", subcategoryController.createSubcategory);
router.patch("/:id", subcategoryController.updateSubcategory);
module.exports = router;
