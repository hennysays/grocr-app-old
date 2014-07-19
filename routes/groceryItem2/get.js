var mongoose = require ("mongoose");
var GroceryItem2  = mongoose.model('GroceryItem2');

exports.get = function(req, res) {	
	var query = req.query.query;
	console.log("Query is " + query);
	var re = new RegExp(query, 'i');
	
    GroceryItem2.find().or([{ 'name': { $regex: re }}, { 'description': { $regex: re }}]).lean().exec(function (err, items) {
  		if (err) {
  			res.send(500,{message: "FAILURE"});
  		}
  		else {
			res.send(200,items);
		}
	})

	
}

