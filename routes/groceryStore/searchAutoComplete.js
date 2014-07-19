var mongoose = require ("mongoose");
var GroceryStore  = mongoose.model('GroceryStore');

exports.searchAutoComplete = function(req, res) {	
	var maxDistance = req.body.distanceOpt;
	var lng = req.body.lng;
	var lat = req.body.lat;

    GroceryStore.find({}).where('geo').near({ center: [lng,lat], maxDistance: maxDistance/6371, spherical: true }).lean().exec(function (err, items) {
  		if (err) return handleError(err);
		formattedItems = [];
		for(i=0;i<items.length;i++) {
			formattedItems.push(items[i].name + ", " + items[i].street + ", " + items[i].city);
		}
		res.send(formattedItems);
	})
	
}