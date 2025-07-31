const express = require('express');
const router = express.Router();
const api_service = require('../controllers/statController');
const authenticateToken = require('../middleware/authMiddleware');
router.get('/dashboard_stats', authenticateToken, (req, res) => {
    api_service.dashboardStat(req, res);
})

module.exports = router;