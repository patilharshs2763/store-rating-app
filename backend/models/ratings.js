const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ratings extends Model {
        static associate(models) {
            ratings.belongsTo(models.users, {
                foreignKey: 'user_id',
                targetKey: 'user_id',
                as: 'user_ratings',
            });
            ratings.belongsTo(models.stores, {
                foreignKey: 'store_id',
                targetKey: 'store_id',
                as: 'store_ratings',
            });
        }
    }

    ratings.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            store_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'ratings',
            tableName: 'ratings',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    return ratings;
};
