const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class stores extends Model {
        static associate(models) {
            stores.belongsTo(models.users, {
                foreignKey: 'user_id',
                targetKey: 'user_id',
                as: 'owner_details',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
            stores.hasMany(models.ratings, {
                foreignKey: 'store_id',
                sourceKey: 'store_id',
                as: 'rating_details',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });

        }
    }
    stores.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        store_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
        {
            sequelize,
            modelName: 'stores',
            tableName: 'stores',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    );
    return stores
}