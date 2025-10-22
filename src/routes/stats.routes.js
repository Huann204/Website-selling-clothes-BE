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

router.get("/sold-products", getSoldProducts);
router.get("/top-categories", getTopCategories);
router.get("/top-sold", getTopSoldProducts);
router.get("/order-stats", getOrderStats);
router.get("/monthly-stats", getMonthlyStats);
// router.get("/overall-stats", getOverallStats);
router.get("/stats-all", getStatsAll);
router.get("/overview-stats", getOverviewStats);

module.exports = router;
