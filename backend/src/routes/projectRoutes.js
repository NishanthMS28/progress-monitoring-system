const express = require('express');
const router = express.Router();
const { updateProjectPreferences } = require('../controllers/projectController');
const { protect, ownerOnly } = require('../middleware/authMiddleware');

router.put('/:id/preferences', protect, ownerOnly, updateProjectPreferences);

module.exports = router;
