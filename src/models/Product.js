const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Product.belongsTo(models.user, { foreignKey: 'sellerId', as: 'seller' });
        }
    }

    Product.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            cost: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            productName: {
                type: DataTypes.STRING,
                field: 'productName',
                allowNull: false,
            },
            sellerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'sellerId',
                references: {
                    model: 'users', // Make sure this matches the table name for users
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'product',
            underscored: true,
            timestamps: true, // If Sequelize handles created_at and updated_at
        },
    );
    return Product;
};
