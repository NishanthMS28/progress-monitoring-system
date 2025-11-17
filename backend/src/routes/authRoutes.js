const express = require('express');
const router = express.Router();
const { register, login, getMe, getCustomers } = require('../controllers/authController');
const { protect, ownerOnly } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/customers', protect, ownerOnly, getCustomers);

module.exports = router;

