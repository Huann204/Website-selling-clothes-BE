const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authAdminOrSuper = require("../middleware/authAdminOrSuper.middleware");
router.get("/", productController.getAllProducts);
router.get("/search", productController.searchProducts);
router.get("/:id", productController.getProductById);
router.post("/", authAdminOrSuper, productController.createProduct);
router.put("/:id", authAdminOrSuper, productController.updateProduct);
router.delete("/:id", authAdminOrSuper, productController.deleteProduct);

module.exports = router;
