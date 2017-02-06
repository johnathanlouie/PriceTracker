require('../web/base.js');

function HistoryDAOTest() {
	this.dao = load('web.domain.HistoryDAO');
	this.dao.dbName = 'pricetrackTest';
}

HistoryDAOTest.prototype.generateProducts = function(num) {
	const products = [];
	for (let i = 0; i < num; i ++) {
		const date = new Date();
		products.push({
			productId: 'testId' + i,
			title: 'test product ' + i,
			price: 10.0 + i,
			timestamp: date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()
		});
	}
	return products;
}

HistoryDAOTest.prototype.deleteAll = function() {
	const test = require('assert');

	return this.dao._deleteAll()
		.catch( (error) => {
			test(null === error, 'Cleanup failed');
		});
}

HistoryDAOTest.prototype.testInsertEmpty = function(products) {
	const test = require('assert');

	let taskChain = Promise.resolve();
	for (let i in products) {
		const productId = products[i].productId;
		taskChain = taskChain
			.then( () => {
				return this.dao.insertEmpty(productId);
			})
			.then( (insertCount) => {
				test.equal(1, insertCount);
			});
	}

	return taskChain;
}

HistoryDAOTest.prototype.testGetProductIds = function(products) {
	const test = require('assert');

	return this.dao.getProductIds()
		.then( (docs) => {
			// Check length
			test.equal(products.length, docs.length);
		});
}

HistoryDAOTest.prototype.testUpdateAndGetByProductId = function(products) {
	const test = require('assert');

	let taskChain = Promise.resolve();
	for (let i in products) {
		const expected = products[i];
		taskChain = taskChain
			.then( () => { // Test update
				return this.dao.update(expected);
			})
			.then( (updateCount) => { // Check update count == 1
				test(1, updateCount);
			})
			.then( () => { // Test getByProductId
				return this.dao.getByProductId(expected.productId);
			})
			.then( (doc) => { // Check fields one by one
				test.equal(doc.productId, expected.productId);
				test.equal(doc.title, expected.title);
				test.equal(doc.history[0].price, expected.price);
				test.equal(doc.history[0].timestamp, expected.timestamp);
			});
	}

	return taskChain;
}

describe('HistoryDAO', () => {
	const testSuit = new HistoryDAOTest();
	const products = testSuit.generateProducts(10);

	before( () => {
		return testSuit.deleteAll();
	});

	it('insertEmpty', () => {
		return testSuit.testInsertEmpty(products);
	});

	it('getProductIds', () => {
		return testSuit.testGetProductIds(products);
	});

	it('update and getByProductId', () => {
		return testSuit.testUpdateAndGetByProductId(products);
	});
});