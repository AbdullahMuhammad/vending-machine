const chai = require('chai');
const sinon = require('sinon');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const UserService = require('../../src/service/UserService');
const UserDao = require('../../src/dao/UserDao');
const DepositDao = require('../../src/dao/DepositDao');
const { expect } = chai;

describe('UserService', () => {
    let userService;
    let userDaoStub;
    let depositDaoStub;

    beforeEach(() => {
        userService = new UserService();
        userDaoStub = sinon.stub(UserDao.prototype);
        depositDaoStub = sinon.stub(DepositDao.prototype);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createUser', () => {
        it('should create a user successfully', async () => {
            const userBody = {
                email: 'newuser@example.com',
                password: 'Password123',
                "first_name": "Duda",
                "last_name": "Bro",
                "confirm_password": "myhappypass",
                "address": "123 Buyer St",
                "phone_number": "123-456-7890",
                "role": "buyer"
            };

            userDaoStub.isEmailExists.resolves(false);
            userDaoStub.create.resolves({ id: 1, ...userBody });

            const result = await userService.createUser(userBody);

            expect(result.response.status).to.be.true;
            expect(result.statusCode).to.equal(httpStatus.CREATED);
        });

        it('should return an error if email already exists', async () => {
            const userBody = {
                email: 'existinguser@example.com',
                password: 'Password123',
            };

            userDaoStub.isEmailExists.resolves(true);

            const result = await userService.createUser(userBody);
            expect(result.response.status).to.be.false;
            expect(result.statusCode).to.equal(httpStatus.BAD_REQUEST);
        });
    });

    describe('isEmailExists', () => {
        it('should return true if email exists', async () => {
            userDaoStub.isEmailExists.resolves(true);

            const result = await userService.isEmailExists('existinguser@example.com');
            expect(result.response.status).to.be.true;
            expect(result.statusCode).to.equal(httpStatus.OK);
        });

        it('should return false if email does not exist', async () => {
            userDaoStub.isEmailExists.resolves(false);

            const result = await userService.isEmailExists('nonexistent@example.com');
            expect(result.response.status).to.be.false;
            expect(result.statusCode).to.equal(httpStatus.BAD_REQUEST);
        });
    });

    describe('resetDeposit', () => {
        it('should reset the deposit of a buyer to 0', async () => {
            const uuid = 'some-uuid-for-buyer'; // Example UUID for buyer
            const role = 'buyer';
    
            userDaoStub.findOneByWhere.resolves({ id: 1, uuid, role });
            depositDaoStub.updateAmount.resolves({ userId: 1, deposit: 0 });
    
            const result = await userService.resetDeposit(uuid);
    
            expect(result.response.status).to.be.true;
            expect(result.statusCode).to.equal(httpStatus.OK);
            expect(result.response.data.newDepositAmount).to.equal(0);
        });
    
        it('should not reset the deposit for a seller', async () => {
            const uuid = 'some-uuid-for-seller'; // Example UUID for seller
            const role = 'seller';
    
            userDaoStub.findOneByWhere.resolves({ id: 2, uuid, role });
    
            const result = await userService.resetDeposit(uuid);
    
            expect(result.response.status).to.be.false;
            expect(result.statusCode).to.equal(httpStatus.FORBIDDEN);
        });
    });

});
