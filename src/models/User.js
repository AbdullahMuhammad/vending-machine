const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Example: User.hasMany(models.SomeOtherModel);
            User.hasMany(models.product, { foreignKey: 'sellerId', as: 'products' });
            User.hasOne(models.deposit, { foreignKey: 'userId', as: 'deposit' });
        }
    }

    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
            },
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                primaryKey: true,
            },
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: DataTypes.INTEGER,
            email_verified: DataTypes.INTEGER,
            address: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            role: {
                type: DataTypes.ENUM,
                values: ['buyer', 'seller'],
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'user',
            underscored: true,
        },
    );
    return User;
};
