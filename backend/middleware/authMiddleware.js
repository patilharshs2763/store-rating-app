const db = require('../models')
const jwt = require('jsonwebtoken');
async function authenticateToken(req, res, next) {
    try {
        const token = req.headers['x-id-token'];
        if (!token) {
            return res.status(401).json({ message: 'Invalid token', error: error.message })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('decoded', decoded);
        req.user = decoded;
        if (decoded.user_id) {
            const checkIsValidUser = await db.users.findOne({
                where: { user_id: decoded.user_id }
            })
            if (!checkIsValidUser) {
                return res.status(401).json({
                    message: 'Unauthorized token'
                })
            }
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', error: error.message })
    }

}
module.exports = authenticateToken;