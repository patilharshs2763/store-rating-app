const db = require('../models');

async function dashboardStat(req, res) {
    try {
        const users_count = await db.users.count();
        const stores_count = await db.stores.count();
        const ratings_count = await db.ratings.count();
        return res.status(200).json({
            message: 'Data fetched successfuly',
            totalRatings: ratings_count,
            totalUsers: users_count,
            totalStores: stores_count
        })
    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json({ message: 'Internal Server error' })

    }
}

module.exports = { dashboardStat };