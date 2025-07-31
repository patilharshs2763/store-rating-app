const { where } = require('sequelize');
const db = require('../models');
const Joi = require('joi');
const { Op } = require('sequelize')

async function createStore(req, res) {
    const storeSchema = Joi.object({
        name: Joi.string().min(3).max(60).required().messages({
            'any.required': 'Name is required'
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Email is required'
        }),
        address: Joi.string().max(400).required().messages({
            'any.required': 'Address is required'
        }),
        user_id: Joi.string().uuid().required().messages({
            'any.required': 'User ID is required',
            'string.guid': 'User ID must be a valid UUID',
        }),
    })
    try {
        const { error, value } = storeSchema.validate(req.body);
        if (error) {
            const errorMessage = error.messages.replace(/"/g, '');
            return res.status(404).json({
                error: errorMessage
            });
        }
        const isUserExists = await db.users.findOne({
            where: {
                user_id: value.user_id
            }
        })
        if (!isUserExists) {
            return res.status(400).json({
                message: `User not found with uuid ${value.user_id}`
            })
        }
        const isStoreExist = await db.stores.findOne({
            where: { email: value.email }
        })
        if (isStoreExist) {
            return res.status(400).json({
                message: `Store exists with email ${value.email}`
            })
        }
        const storeResult = await db.stores.create({ ...value });
        return res.status(201).json({
            message: "Store created successfully",
            data: storeResult
        });

    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json({ error: 'Server error' })
    }
}
async function getAllStores(req, res) {
    try {
        let pageNo = parseInt(req.query.currentPage, 10) || 1;
        let limit = parseInt(req.query.entriesPerPage, 10);
        let search = req.query.searchTerm || '';
        if (pageNo <= 0) {
            return res.status(400).json({ message: 'Page number must be greater than 0' });
        }

        if (limit <= 0) {
            return res.status(400).json({ message: 'Limit must be greater than 0' });
        }
        const validSortKeys = ['name', 'email', 'address', 'rating'];
        let order = [];
        for (let key of validSortKeys) {
            if (req.query[key]) {
                const direction = req.query[key].toUpperCase();
                if (direction !== 'ASC' && direction !== 'DESC') {
                    return res.status(400).json({ message: `Invalid sort direction for ${key}` });
                }

                if (key === 'rating') {
                    order.push([
                        db.sequelize.literal(`(
                    SELECT AVG("rating")
                    FROM "ratings"
                    WHERE "ratings"."store_id" = "stores"."store_id"
                )`),
                        direction
                    ]);
                } else if (key === 'owner_name') {
                    order.push([{ model: db.users, as: 'owner_details' }, 'name', direction]);
                } else {
                    order.push([key, direction]);
                }

                break;
            }
        }

        if (order.length === 0) {
            order.push(['id', 'DESC']);
        }
        let whereclause = {};
        if (search) {
            whereclause = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { address: { [Op.iLike]: `%${search}%` } },
                ]
            };
        }

        let result;
        if (!limit) {
            result = await db.stores.findAndCountAll(
                {
                    where: whereclause,
                    include: [
                        {
                            model: db.users,
                            as: 'owner_details',
                            attributes: { exclude: ['password'] },
                            required: false
                        },
                        {
                            model: db.ratings,
                            as: 'rating_details',
                            required: false
                        }
                    ],
                    order
                })
            // console.log(result)
        } else {
            let offset = (pageNo - 1) * limit
            result = await db.stores.findAndCountAll({
                where: whereclause,
                include: [
                    {
                        model: db.users,
                        as: 'owner_details',
                        attributes: { exclude: ['password'] },
                        required: false
                    },
                    {
                        model: db.ratings,
                        as: 'rating_details',
                        required: false
                    }
                ],
                order,
                offset,
                limit
            })
        }
        return res.status(200).json({
            data: result.rows,
            totalStores: result.count,
            message: 'Store fetched successfully',
        })
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = {
    createStore,
    getAllStores
}
