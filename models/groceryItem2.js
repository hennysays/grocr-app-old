var mongoose = require('mongoose');
var groceryItem2Schema = mongoose.Schema({
		name: String,
		description: String,
		price: String,
		unitPrice: Number,
		imageURL: String,
		// units: String,
		// unitPrice: Number,
		// date: Number,
		// category: Number,
		// OLD FIELDS
 		// quantity: Number,
 		// image: String
	});

module.exports = mongoose.model('GroceryItem2',groceryItem2Schema);
