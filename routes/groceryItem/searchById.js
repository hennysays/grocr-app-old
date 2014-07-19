var mongoose = require ("mongoose");
var groceryItem  = mongoose.model('GroceryItem');

exports.searchById = function(req, res) {	
	var query = req.body.query;
	var id = mongoose.Types.ObjectId(query);
    groceryItem.findById(id).lean().exec(function (err, item) {
  		if (err) return handleError(err);
    	console.log('%s costs %s', entry.name, entry.price);
		res.send(item);


	})
	
}