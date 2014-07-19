var mongoose = require ("mongoose");
var GroceryItem  = mongoose.model('GroceryItem');

exports.search = function(req, res) {	
	var query = req.body.query;
	var category = req.body.category;
	var re = new RegExp(query, 'i');

	if(category!=0) {
		GroceryItem.find({category:category}).populate("store").sort('unitPrice').lean().exec(function (err, items) {
	  		if (err) {
	  			return handleError(err);
	  		}
			res.send(items);
		})
	}

	else {
	    GroceryItem.find().or([{ 'name': { $regex: re }}, { 'description': { $regex: re }}]).populate("store").sort('unitPrice').lean().exec(function (err, items) {
	  		if (err) {
	  			return handleError(err);
	  		}
			res.send(items);
		})
	}
	
}

