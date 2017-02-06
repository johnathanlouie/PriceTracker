/* global Promise, load */

var HistoryDAO = HistoryDAO || {
	dbName: 'pricetrack',
	collectionName: 'history'
};

HistoryDAO.getByProductId = function(productId)
{
	try
	{
		return this._getCollection()
				.then(
						function(collection)
						{
							return collection.findOne({productId: productId}, {_id: false});
						}
				)
				.then(function(result)
				{
					return result;
				})
				.catch(function(error)
				{
					return Promise.reject({message: 'HistoryDAO.getByProductId: ' + error.message});
				});
	}
	catch (e)
	{
		console.log(e);
		return Promise.reject({message: 'HistoryDAO.getByProductId(exception): ' + e.message});
	}
};

HistoryDAO._getCollection = function()
{
	try
	{
		return load('web.domain.MongoDB').connection.get(this.dbName)
				.then(function(connection)
				{
					return connection.collection(this.collectionName);
				})
				.catch(function(error)
				{
					return Promise.reject('HistoryDAO._getCollection: ' + error.message);
				});
	}
	catch (e)
	{
		console.log(e);
		return Promise.reject({message: 'HistoryDAO._getCollection(exception): ' + e.message});
	}
};

module.exports = HistoryDAO;