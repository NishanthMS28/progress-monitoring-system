const express = require('express');
const router = express.Router();
const { protect, ownerOnly } = require('../middleware/authMiddleware');
const {
  getLatest,
  getHistory,
  getStats,
  getOverview,
  getChartData
} = require('../controllers/progressController');

router.get('/latest/:projectId', protect, getLatest);
router.get('/history/:projectId', protect, getHistory);
router.get('/stats/:projectId', protect, getStats);
router.get('/chart/:projectId', protect, getChartData);
router.get('/overview', protect, ownerOnly, getOverview);

module.exports = router;

