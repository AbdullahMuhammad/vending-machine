const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class Deposit extends Model {
        static associate(models) {
            Deposit.belongsTo(models.user, { foreignKey: 'userId', as: 'users' });
        }
    }

    Deposit.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'userId',
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    }, {
        sequelize,
            modelName: 'deposit',
            underscored: true,
            timestamps: true, // If Sequelize handles created_at and updated_at
    });

    return Deposit;
};
