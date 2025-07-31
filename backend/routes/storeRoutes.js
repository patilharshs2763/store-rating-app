const express = require('express');
const router = express.Router();
const api_service = require('../controllers/storeContoller');
const authenticateToken = require('../middleware/authMiddleware');
router.post('/store', authenticateToken, (req, res) => {
    api_service.createStore(req, res);
})

router.get('/store', authenticateToken, (req, res) => {
    api_service.getAllStores(req, res);
})
module.exports = router;