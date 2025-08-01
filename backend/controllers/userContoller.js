const db = require('../models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { Op, where } = require('sequelize');

async function registerUser(req, res) {
    const userSchema = Joi.object({
        name: Joi.string().min(20).max(60).required().messages({
            'any.required': 'Name is required'
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Email is required'
        }),
        address: Joi.string().max(400).required().messages({
            'any.required': 'Address is required'
        }),
        password: Joi.string()
            .min(8)
            .max(16)
            .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/)
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 8 characters',
                'string.max': 'Password must be at most 16 characters',
                'string.pattern.base': 'Password must include at least one uppercase letter and one special character',
            }),
    })
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            const errorMessage = error.message.replace(/"/g, '');
            return res.status(400).json({
                error: errorMessage
            });
        }

        const isUserExist = await db.users.findOne({
            where: {
                email: value.email
            }
        });
        if (isUserExist) {
            return res.status(409).json({ message: `User already exists with name ${value.email}` })
        }
        const hashedPassword = await bcrypt.hash(value.password, 10);
        value.password = hashedPassword;
        console.log('value: ', value);

        const result = await db.users.create({
            ...value
        })
        if (result) {
            return res.status(201).json({
                message: 'User created successfully',
                data: result
            })
        }


    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json({ error: 'Server error' })
    }
}
async function createUser(req, res) {
    const userSchema = Joi.object({
        name: Joi.string().min(20).max(60).required().messages({
            'any.required': 'Name is required'
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Email is required'
        }),
        address: Joi.string().max(400).required().messages({
            'any.required': 'Address is required'
        }),
        password: Joi.string()
            .min(8)
            .max(16)
            .pattern(/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$/)
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 8 characters',
                'string.max': 'Password must be at most 16 characters',
                'string.pattern.base': 'Password must include at least one uppercase letter and one special character',
            }),
        role: Joi.string().valid('Normal User', 'System Administrator', 'Store Owner').required().messages({
            'any.required': 'Role is required',
            'any.valid': 'Not a valide role'
        })
    })
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            const errorMessage = error.message.replace(/"/g, '');
            return res.status(404).json({
                error: errorMessage
            });
        }

        const isUserExist = await db.users.findOne({
            where: {
                email: value.email
            }
        });
        if (isUserExist) {
            return res.status(409).json({ message: `User already exists with email ${value.email}` })
        }
        const hashedPassword = await bcrypt.hash(value.password, 10);
        value.password = hashedPassword;
        console.log('value: ', value);

        const result = await db.users.create({
            ...value
        })
        if (result) {
            return res.status(201).json({
                message: 'User added successfully',
                data: result
            })
        }


    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json({ error: 'Server error' })
    }
}
async function getAllUsers(req, res) {
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
        const validSortKeys = ['name', 'email', 'address', 'role'];
        let order = [];
        for (let key of validSortKeys) {
            if (req.query[key]) {
                const direction = req.query[key].toUpperCase();
                if (direction === 'ASC' || direction === 'DESC') {
                    order.push([key, direction]);
                } else {
                    return res.status(400).json({ message: `Invalid sort direction for ${key}` });
                }
                break;
            }
        }
        if (order.length === 0) {
            order.push(['id', 'ASC']);
        }
        let whereclause = {};
        if (search) {
            whereclause = {
                ...whereclause,
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { address: { [Op.iLike]: `%${search}%` } },]
            }
        }

        const loggedInUser = req.user;
        const userRole = loggedInUser.role;
        const userId = loggedInUser.user_id;
        let storeWhereClause = {}
        let ownerStoreDetails = null;

        if (userRole === 'Store Owner') {
            ownerStoreDetails = await db.stores.findOne({
                where: { user_id: userId },
                include: [
                    {
                        model: db.ratings,
                        as: 'rating_details',
                        required: false
                    }
                ]
            });
            const ownerStore = await db.stores.findOne({ where: { user_id: userId } });
            console.log('ownerStore: ', ownerStore);
            if (!ownerStore) {
                return res.status(404).json({ message: 'No store found for this owner' });
            }

            storeWhereClause.store_id = ownerStore.store_id;
            whereclause = {
                ...whereclause,
                role: { [Op.notIn]: ['System Administrator', 'Store Owner'] }
            };

        }
        let result;
        if (!limit) {
            result = await db.users.findAndCountAll({
                attributes: { exclude: ['password'] },
                where: whereclause,
                order: [['id', 'desc']],
                include: [
                    {
                        model: db.stores,
                        as: 'store_details',
                        required: false,
                    },
                    {
                        model: db.ratings,
                        as: 'ratings_details',
                        where: storeWhereClause,
                        required: false,
                        include: [
                            {
                                model: db.stores,
                                as: 'store_ratings',
                                required: true
                            }
                        ]
                    }
                ]
            })
        } else {
            let offset = (pageNo - 1) * limit;
            result = await db.users.findAndCountAll({
                attributes: { exclude: ['password'] },
                where: whereclause,
                distinct: true,

                include: [
                    {
                        model: db.stores,
                        as: 'store_details',
                        required: false,
                    },
                    {
                        model: db.ratings,
                        where: storeWhereClause,
                        as: 'ratings_details',
                        required: false,
                        include: [
                            {
                                model: db.stores,
                                as: 'store_ratings',
                                require: true
                            }
                        ]
                    }
                ],
                order,
                offset,
                limit
            })
        }
        console.log("result", result);
        let resultObj = {
            message: 'Data fetched successfullt',
            data: result.rows,
            total: result.count
        }
        if (userRole === 'Store Owner') {
            resultObj.store_details = ownerStoreDetails
        }
        return res.status(200).json(resultObj)
    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json({ error: 'Server error' })
    }
}
module.exports = {
    registerUser,
    getAllUsers,
    createUser
}