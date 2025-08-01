const db = require('../models');
const Joi = require('joi');
const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();


async function loginUser(req, res) {
    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
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
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            const errorMessage = error.message.replace(/"/g, '');
            return res.status(400).json({
                error: errorMessage,
                message: 'Error while validating'
            });
        }

        const isUserExist = await db.users.findOne({
            where: {
                email: value.email
            }
        })

        if (!isUserExist) {
            return res.status(404).json({
                message: `User not found with email ${value.email}`
            })
        }
        const isValidPass = await bycrpt.compare(value.password, isUserExist.password);
        if (!isValidPass) {
            return res.status(401).json({
                message: 'Invalid Password'
            })
        }

        const payload = {
            user_id: isUserExist.user_id,
            name: isUserExist.name,
            email: isUserExist.email,
            role: isUserExist.role,
            address: isUserExist.address

        };
        console.log(payload);
        const token = jwt.sign(
            { ...payload },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '12hr' }
        )
        return res.status(200).json({
            message: 'Login successfull',
            token: token
        })

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error })
    }
}

async function changePassword(req, res) {
    const passChange = Joi.object({
        email: Joi.string().email().required(),
        new_password: Joi.string()
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
        const { error, value } = passChange.validate(req.body);
        if (error) {
            const errorMessage = error.message.replace(/"/g, '');
            return res.status(400).json({
                error: errorMessage,
                message: 'Error while validating'
            });
        }

        const isUserExist = await db.users.findOne({
            where: {
                email: value.email
            },
        })

        if (!isUserExist) {
            return res.status(400).json({
                message: `User not found with email ${value.email}`
            })
        }
        const hashedPassword = await bycrpt.hash(value.new_password, 10);
        const result = await db.users.update(
            { password: hashedPassword },
            { where: { email: value.email } }
        )
        if (!result) {
            return res.status(500).json({
                message: 'Failed to update password'
            })
        }
        return res.status(200).json({
            message: 'Password updated successfully'
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error })
    }
}

module.exports = {
    loginUser,
    changePassword
}