const express = require('express');
const router = express.Router();
const { protect, ownerOnly } = require('../middleware/authMiddleware');
const { sendTest, sendSummary, getEmailHistory } = require('../controllers/emailController');

router.post('/test', protect, ownerOnly, sendTest);
router.post('/send', protect, ownerOnly, sendSummary);
router.get('/history/:projectId', protect, getEmailHistory);

module.exports = router;

