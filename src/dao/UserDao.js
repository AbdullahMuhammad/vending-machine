const SuperDao = require('./SuperDao');
const models = require('../models');
const { rolesEnum } = require('../config/constant');

const User = models.user;

class UserDao extends SuperDao {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return User.findOne({ where: { email } });
    }

    async isEmailExists(email) {
        return User.count({ where: { email } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async createWithTransaction(user, transaction) {
        return User.create(user, { transaction });
    }

    async firstSeller() {
        return User.findOne({ 
            where: { role: rolesEnum.SELLER }
        });
    }

    async firstBuyer() {
        return User.findOne({ 
            where: { role: rolesEnum.BUYER }
        });
    }
}

module.exports = UserDao;
