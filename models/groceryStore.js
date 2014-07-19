var mongoose = require('mongoose');
var groceryStoreSchema = mongoose.Schema({
		name: {type: String, trim: true},
		street: String,
 		city: String,
 		province: String,
 		country: String,
 		lat: Number,
 		lng: Number,
 		geo: {type:[Number], index: '2dsphere'},
 		publicationId: String,
 		_id: Number
	});
module.exports = mongoose.model('GroceryStore',groceryStoreSchema);