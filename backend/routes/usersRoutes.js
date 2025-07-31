const express = require('express');
const router = express.Router();
const api_service = require('../controllers/userContoller');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/register', (req, res) => {
    api_service.registerUser(req, res);
})
router.post('/user', authenticateToken, (req, res) => {
    api_service.createUser(req, res);
})
router.get('/user', authenticateToken, (req, res) => {
    api_service.getAllUsers(req, res);
})
module.exports = router;