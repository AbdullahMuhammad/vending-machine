const chai = require('chai');
const sinon = require('sinon');
const httpStatus = require('http-status');
const ProductsService = require('../../src/service/ProductsService');
const ProductsDao = require('../../src/dao/ProductsDao');
const { expect } = chai;

describe('ProductsService', () => {
    let productsService;
    let productsDaoStub;

    beforeEach(() => {
        productsService = new ProductsService();
        productsDaoStub = sinon.stub(ProductsDao.prototype);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getProducts', () => {
        it('should retrieve a list of products', async () => {
            productsDaoStub.findAll.resolves([{ id: 1, name: 'Product 1', price: 5 }, { id: 2, name: 'Product 2', price: 10 }]);
    
            const result = await productsService.getProducts();
            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(2);
        });
    });

    describe('getProductById', () => {
        it('should retrieve details of a product', async () => {
            const productId = 1;
            productsDaoStub.findById.resolves({ id: productId, name: 'Product 1' });
    
            const result = await productsService.getProductById(productId);
            expect(result).to.be.an('object');
            expect(result).to.have.property('id', productId);
        });
    });

    describe('createProduct', () => {
        it('should create a product', async () => {
            const newProductData = { name: 'New Product', sellerId: 1 };
            productsDaoStub.create.resolves(newProductData);
    
            const result = await productsService.createProduct(newProductData);
            expect(result).to.be.an('object');
            expect(result).to.have.property('name', 'New Product');
        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            const productId = 1;
            const updateData = { name: 'Updated Product' };
            productsDaoStub.update.resolves(updateData);
    
            const result = await productsService.updateProduct(productId, updateData);
            expect(result).to.be.an('object');
            expect(result).to.have.property('name', 'Updated Product');
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            const productId = 1;
            productsDaoStub.delete.resolves({ id: productId });
    
            const result = await productsService.deleteProduct(productId);
            expect(result).to.be.an('object');
            expect(result).to.have.property('id', productId);
        });
    });
    
});
