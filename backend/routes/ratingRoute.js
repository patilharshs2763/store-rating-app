const express = require('express');
const router = express.Router();
const api_service = require('../controllers/ratingController');
const authenticateToken = require('../middleware/authMiddleware');

router.put('/rating', authenticateToken, (req, res) => {
    api_service.giveRating(req, res);
});
router.get('/rating', authenticateToken, (req, res) => {
    api_service.getAllRatings(req, res);
})
module.exports = router;