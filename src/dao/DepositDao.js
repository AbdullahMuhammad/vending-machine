const SuperDao = require('./SuperDao');
const models = require('../models');

const Deposit = models.deposit; // Assuming your Deposit model is named 'deposit'

class DepositDao extends SuperDao {
    constructor() {
        super(Deposit);
    }

    // Create or update a deposit record
    async createOrUpdate({ userId, amount }) {

        const deposit = await Deposit.findOne({
            where: { userId: userId }
        });

        if (deposit) {
            // If a deposit record exists, add the coin value to the current amount
            deposit.amount += amount;
            return deposit.save();
        } else {
            // If no deposit record exists, create a new one with the coin value as the initial amount
            return Deposit.create({ userId, amount: amount });
        }
    }

    /**
     * Find a deposit by user ID.
     * @param {number} userId - The ID of the user whose deposit is to be found.
     * @returns {Promise<Model|null>} A promise that resolves with the deposit found, or null if not found.
     */
    async findByUserId(userId) {
        return await Deposit.findOne({
            where: { userId: userId }
        });
    }


    /**
     * Update the deposit amount for a given user.
     * @param {number} userId - The ID of the user whose deposit is to be updated.
     * @param {number} newAmount - The new amount to set for the deposit.
     * @returns {Promise<Model>} A promise that resolves with the updated deposit.
     */
    async updateAmount(userId, newAmount) {
        const deposit = await Deposit.findOne({ where: { userId } });
        if (!deposit) {
            throw new Error('Deposit not found for the given user ID');
        }

        deposit.amount = newAmount;
        return await deposit.save();
    }    

}

module.exports = DepositDao;
