const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class users extends Model {
        static associate(models) {
            users.hasMany(models.stores, {
                foreignKey: 'user_id',
                sourceKey: 'user_id',
                as: 'store_details',
            });
            users.hasMany(models.ratings, {
                foreignKey: 'user_id',
                sourceKey: 'user_id',
                as: 'ratings_details',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        }
    }
    users.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.ENUM('System Administrator', 'Store Owner', 'Normal User'),
            allowNull: false,
            defaultValue: 'Normal User'
        },

    },
        {
            sequelize,
            modelName: 'users',
            tableName: 'users',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
    return users;
}