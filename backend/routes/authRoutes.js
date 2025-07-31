const express = require('express');
const router = express.Router();
const api_service = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware')
router.post('/auth', (req, res) => {
    api_service.loginUser(req, res);
})

router.patch('/auth', authenticateToken, (req, res) => {
    api_service.changePassword(req, res);
})

module.exports = router;