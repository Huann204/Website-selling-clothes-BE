const express = require("express");
const router = express.Router();
const {
  getSoldProducts,
  getTopSoldProducts,
  getTopCategories,
  getOrderStats,
  getMonthlyStats,
  getStatsAll,
  getOverviewStats,
} = require("../controllers/stats.controller");
const authAdminOrSuper = require("../middleware/authAdminOrSuper.middleware");
router.get("/sold-products", getSoldProducts);
router.get("/top-categories", authAdminOrSuper, getTopCategories);
router.get("/top-sold", authAdminOrSuper, getTopSoldProducts);
router.get("/order-stats", authAdminOrSuper, getOrderStats);
router.get("/monthly-stats", authAdminOrSuper, getMonthlyStats);
// router.get("/overall-stats", getOverallStats);
router.get("/stats-all", authAdminOrSuper, getStatsAll);
router.get("/overview-stats", authAdminOrSuper, getOverviewStats);

module.exports = router;
