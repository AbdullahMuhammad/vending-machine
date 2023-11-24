const SuperDao = require('./SuperDao');
const models = require('../models');

const Deposit = models.deposit; // Assuming your Deposit model is named 'deposit'

class DepositDao extends SuperDao {
    constructor() {
        super(Deposit);
    }

    // Create or update a deposit record
    async createOrUpdate({ userId, amount }) {

        const deposit = await Deposit.findOne({ where: { userId } });

        if (deposit) {
            // If a deposit record exists, add the coin value to the current amount
            deposit.amount += amount;
            return deposit.save();
        } else {
            // If no deposit record exists, create a new one with the coin value as the initial amount
            return Deposit.create({ userId, amount: amount });
        }
    }

    // ... You can add more methods as needed ...
}

module.exports = DepositDao;
