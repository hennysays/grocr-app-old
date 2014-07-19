var mongoose = require ("mongoose");
var GroceryItem  = mongoose.model('GroceryItem');

exports.search2 = function(req, res) {	
	var query = req.query.query;
	console.log("Query is " + query);
	var re = new RegExp(query, 'i');
	
    GroceryItem.find().or([{ 'name': { $regex: re }}, { 'description': { $regex: re }}]).populate("store").sort('unitPrice').lean().exec(function (err, items) {
  		if (err) {
  			res.send(500,{message: "FAILURE"});
  		}
  		else {
			res.send(200,items);
		}
	})

	
}

