const db = require('../models');
const Joi = require('joi');

async function giveRating(req, res) {
    const ratingSchema = Joi.object({
        user_id: Joi.string().uuid().required().messages({
            'any.required': 'User ID is required',
            'string.guid': 'User ID must be a valid UUID',
        }),
        store_id: Joi.string().uuid().required().messages({
            'any.required': 'Store ID is required',
            'string.guid': 'Store ID must be a valid UUID',
        }),
        rating: Joi.number().integer().min(1).max(5).required().messages({
            'any.required': 'Rating is required',
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating must not greater than 5',
        })
    });

    try {
        const { error, value } = ratingSchema.validate(req.body);
        if (error) {
            const errorMessage = error.message.replace(/"/g, '');
            return res.status(400).json({ error: errorMessage });
        }

        const { user_id, store_id, rating } = value;

        const storeExists = await db.stores.findOne({ where: { store_id } });
        if (!storeExists) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const existingRating = await db.ratings.findOne({
            where: { user_id, store_id }
        });

        if (existingRating) {
            await existingRating.update({ rating });
            return res.status(200).json({ message: 'Rating updated successfully' });
        } else {
            await db.ratings.create({ user_id, store_id, rating });
            return res.status(201).json({ message: 'Rating submitted successfully' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getAllRatings(req, res) {
    try {
        const result = await db.ratings.count();
        return res.status(200).json({ message: `Total ratings till now ${result}`, total: result })
    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error })

    }
}

module.exports = {
    giveRating,
    getAllRatings
}