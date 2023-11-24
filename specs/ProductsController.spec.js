const request = require('supertest');
const expect = require('chai').expect;
const TokenService = require('../src/service/TokenService');
const moment = require('moment');
const UserDao = require('../src/dao/UserDao.js');
const ProductsDao = require('../src/dao/ProductsDao.js')

const app = require('../src/app.js');


describe('ProductsController', () => {

    let authToken;
    let sellerId;
    let uuid;
    let firstProduct;

    before(async () => {
        const userDao = new UserDao();
        const productsDao = new ProductsDao();
        const firstSeller = await userDao.firstSeller();
        firstProduct = await productsDao.first();
        if (firstSeller) {
            sellerId = firstSeller.id;
            uuid = firstSeller.uuid;
        } else {
            throw new Error('No sellers found in the database.');
        }

        const tokenService = new TokenService();
        const expires = moment().add(1, 'hours'); // Token expiry time
        authToken = tokenService.generateToken(uuid, expires, 'access'); // Assuming 'access' is the token type
    });

    describe('POST /products', () => {
        it('should create a new product', async () => {
            const productData = {
                "quantity": 10,
                "cost": 50,
                "productName": "Sample Product",
                "sellerId": sellerId,
            };
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${authToken}`)
                .send(productData);
            expect(res.status).to.equal(201);
            expect(res.body.data).to.have.property('id');
        });
    });

    describe('GET /products', () => {
        it('should retrieve all products', async () => {
            const res = await request(app)
                .get('/api/products/');
            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.an('array');
        });
    });

    describe('GET /products/:id', () => {
        it('should retrieve a product by ID', async () => {
            const productId = firstProduct.id;
            const res = await request(app)
                .get(`/api/products/${productId}`);
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.property('id', productId);
        });
    });

    describe('PUT /products/:id', () => {
        it('should update a product', async () => {
            const productId = firstProduct.id;
            const updateData = { productName: 'Updated Product', sellerId: sellerId };
            const res = await request(app)
                .put(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            expect(res.status).to.equal(200);
            expect(res.body.message).to.eq('Product updated successfully.');
        });
    });

});
