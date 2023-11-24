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
        return User.findOne({
            where: { role: 'buyer' },
            include: [{
                model: Deposit,
                as: 'deposit', // Assuming the alias is 'deposit'
                required: false, // This includes users without a deposit record
                where: {
                    amount: {
                        [Op.or]: [
                            { [Op.eq]: 0 }, // Deposit amount is 0
                            { [Op.is]: null } // Deposit record does not exist
                        ]
                    }
                }
            }],
            order: [['createdAt', 'ASC']] // Ordering by creation time
        });
    }
}

module.exports = UserDao;
