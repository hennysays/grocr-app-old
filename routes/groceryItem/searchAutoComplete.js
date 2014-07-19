var mongoose = require ("mongoose");
var GroceryItem  = mongoose.model('GroceryItem');

exports.searchAutoComplete = function(req, res) {	
	var query = req.body.query;
    GroceryItem.find({name: RegExp(query, "i")}).distinct("name").lean().exec(function (err, items) {
  		if (err) return handleError(err);
		
		res.send(items);
	})
	
}