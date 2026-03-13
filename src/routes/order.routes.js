const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authAdminOrSuper = require("../middleware/authAdminOrSuper.middleware");

router.get("/", authAdminOrSuper, orderController.getAllOrders);
router.get("/:id", authAdminOrSuper, orderController.getOrderById);
router.post("/", orderController.createOrder);
router.put("/:id", authAdminOrSuper, orderController.updateOrderStatus);
router.delete("/:id", authAdminOrSuper, orderController.deleteOrder);
router.get("/phone/:phone", orderController.getOrderByPhone);
module.exports = router;
