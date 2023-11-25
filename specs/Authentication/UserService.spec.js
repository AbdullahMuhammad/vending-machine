const chai = require('chai');
const sinon = require('sinon');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const UserService = require('../../src/service/UserService');
const UserDao = require('../../src/dao/UserDao');
const { expect } = chai;

describe('UserService', () => {
    let userService;
    let userDaoStub;

    beforeEach(() => {
        userService = new UserService();
        userDaoStub = sinon.stub(UserDao.prototype);
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
            const userId = 1; // Example user ID
            const role = 'buyer';
    
            // Set up stubs to simulate a buyer user and successful deposit reset
            userDaoStub.findById.resolves({ id: userId, role });
            userDaoStub.resetDeposit.resolves({ id: userId, deposit: 0 });
    
            const result = await userService.resetDeposit(userId);
    
            expect(result.response.status).to.be.true;
            expect(result.statusCode).to.equal(httpStatus.OK);
            expect(result.response.data.deposit).to.equal(0);
        });
    
        it('should not reset the deposit for a seller', async () => {
            const userId = 2; // Example user ID
            const role = 'seller';
    
            userDaoStub.findById.resolves({ id: userId, role });
    
            const result = await userService.resetDeposit(userId);
    
            expect(result.response.status).to.be.false;
            expect(result.statusCode).to.equal(httpStatus.FORBIDDEN);
        });
    });

});
