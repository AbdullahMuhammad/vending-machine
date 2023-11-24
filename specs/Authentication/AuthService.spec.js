const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const httpStatus = require('http-status');
const AuthService = require('../../src/service/AuthService');
const UserService = require('../../src/service/UserService');
const UserDao = require('../../src/dao/UserDao');
const models = require('../../src/models');

const User = models.user;
const bcrypt = require('bcryptjs');

let authService;
const loginData = {
    email: 'john@mail.com',
    password: '123123Asd',
};
const userData = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@mail.com',
    uuid: '4d85f12b-6e5b-468b-a971-eabe8acc9d08',
};
describe('User Login test', () => {
    beforeEach(() => {
        authService = new AuthService();
    });
    afterEach(() => {
        sinon.restore();
    });

    it('User Login successfully', async () => {
        const expectedResponse = {
            statusCode: httpStatus.OK,
            response: {
                status: true,
                code: httpStatus.OK,
                message: 'Login Successful',
                data: {
                    uuid: "4d85f12b-6e5b-468b-a971-eabe8acc9d08",
                    first_name: 'John',
                    last_name: 'Doe',
                    email: 'john@mail.com',
                    email_verified: 1,
                    id: 1,
                },
            },
        };
        userData.id = 1;
        userData.password = bcrypt.hashSync(loginData.password, 8);
        userData.email_verified = 1;
        const userModel = new User(userData);

        sinon.stub(UserDao.prototype, 'findByEmail').callsFake((email) => {
            return userModel;
        });
        const userLogin = await authService.loginWithEmailPassword(
            loginData.email,
            loginData.password,
        );
        expect(userLogin).to.deep.include(expectedResponse);
    });

    it('should show INVALID EMAIL ADDRESS message', async () => {
        const expectedResponse = {
            statusCode: httpStatus.BAD_REQUEST,
            response: {
                status: false,
                code: httpStatus.BAD_REQUEST,
                message: 'Invalid Email Address!',
            },
        };

        sinon.stub(UserDao.prototype, 'findByEmail').callsFake(() => {
            return null;
        });
        const response = await authService.loginWithEmailPassword('test@mail.com', '23232132');
        expect(response).to.deep.include(expectedResponse);
    });

    it('Wrong Password', async () => {
        const expectedResponse = {
            statusCode: httpStatus.BAD_REQUEST,
            response: {
                status: false,
                code: httpStatus.BAD_REQUEST,
                message: 'Wrong Password!',
            },
        };
        userData.id = 1;
        userData.password = bcrypt.hashSync('2322342343', 8);
        userData.email_verified = 1;
        const userModel = new User(userData);
        sinon.stub(UserDao.prototype, 'findByEmail').callsFake((email) => {
            return userModel;
        });
        const userLogin = await authService.loginWithEmailPassword(
            loginData.email,
            loginData.password,
        );
        expect(userLogin).to.deep.include(expectedResponse);
    });
});


describe('Buyer deposit tests', () => {
    let userService;
    let userDaoStub;
    let user;

    beforeEach(() => {
        userService = new UserService();
        userDaoStub = sinon.stub(UserDao.prototype);
        user = {
            uuid: 'user-uuid',
            role: 'buyer',
            depositAmount: 0, // Assuming a field to track the deposit amount
            save: sinon.spy() // Stubbing the save method
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('deposit', () => {
        it('should allow a buyer to deposit coins', async () => {
            const coin = 5; // Example coin denomination

            // Stubbing the method to find the user by UUID
            userDaoStub.findOneByWhere.resolves(user);

            const response = await userService.deposit(user.uuid, coin);

            expect(response).to.have.property('statusCode', httpStatus.OK);
            expect(user.depositAmount).to.equal(coin);
            expect(user.save.called).to.be.true;
        });

        it('should not allow a non-buyer to deposit coins', async () => {
            user.role = 'seller'; // Change role to non-buyer

            // Stubbing the method to find the user by UUID
            userDaoStub.findOneByWhere.resolves(user);

            const response = await userService.deposit(user.uuid, 5);

            expect(response).to.have.property('statusCode', httpStatus.FORBIDDEN);
        });

        it('should reject invalid coin denominations', async () => {
            const invalidCoin = 3; // Example of an invalid coin denomination

            // Stubbing the method to find the user by UUID
            userDaoStub.findOneByWhere.resolves(user);

            const response = await userService.deposit(user.uuid, invalidCoin);

            expect(response).to.have.property('statusCode', httpStatus.BAD_REQUEST);
        });

        it('should only allow depositing 5, 10, 20, 50, and 100 cent coins', async () => {
            const validCoins = [5, 10, 20, 50, 100];
            const invalidCoins = [1, 3, 15, 30, 60];
    
            // Stubbing the method to find the user by UUID
            userDaoStub.findOneByWhere.resolves(user);
    
            // Test each valid coin
            for (let coin of validCoins) {
                user.depositAmount = 0; // Reset deposit amount
                const response = await userService.deposit(user.uuid, coin);
                expect(response).to.have.property('statusCode', httpStatus.OK);
                expect(user.depositAmount).to.equal(coin);
            }
    
            // Test each invalid coin
            for (let coin of invalidCoins) {
                user.depositAmount = 0; // Reset deposit amount
                const response = await userService.deposit(user.uuid, coin);
                expect(response).to.have.property('statusCode', httpStatus.BAD_REQUEST);
            }
        });
    });

    
});
