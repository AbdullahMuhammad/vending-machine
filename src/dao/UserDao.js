const SuperDao = require('./SuperDao');
const models = require('../models');
const { rolesEnum } = require('../config/constant');
const { Op } = models.Sequelize;

const User = models.user;
const Deposit = models.deposit;

class UserDao extends SuperDao {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async isEmailExists(email) {
        return await User.count({ where: { email } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async createWithTransaction(user, transaction) {
        return await User.create(user, { transaction });
    }

    async firstSeller() {
        return await User.findOne({
            where: { role: rolesEnum.SELLER }
        });
    }

    async firstBuyer() {
        return await User.findOne({
            where: { role: rolesEnum.BUYER }
        });
    }

    async firstBuyerWithInsufficientFunds() {
        return await User.findOne({
            where: {
                role: rolesEnum.BUYER,
                [Op.or]: [
                    { '$deposits.amount$': 0 },              // Deposit amount is 0
                    { '$deposits.amount$': { [Op.is]: null } }  // No deposit record
                ]
            },
            include: [{
                model: Deposit,
                as: 'deposits',
                required: false  // Left join with Deposit table
            }],
        });
    }

    /**
     * Find a buyer who has funds.
     * @returns {Promise<Model|null>}
     */
    async buyerWithFunds() {
        return await User.findOne({
            where: { 
                role: rolesEnum.BUYER,
                '$deposits.amount$': { [Op.gt]: 0 }  // Deposit amount greater than 0
            },
            include: [{
                model: Deposit,
                as: 'deposits',
                required: true  // Left join with Deposit table
            }],
        });
    }
}

module.exports = UserDao;
