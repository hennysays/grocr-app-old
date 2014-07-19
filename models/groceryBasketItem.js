var mongoose = require('mongoose');
var groceryItemSchema = mongoose.Schema({
		name: String,
		description: String,
		savings: String,
		price: String,
		units: String,
		unitPrice: Number,
		date: Number,
		category: Number,
		store: {type: Number, ref: 'GroceryStore'},
		imageURL: String,

		// OLD FIELDS
 		// quantity: Number,
 		// image: String
	});

module.exports = mongoose.model('GroceryItem',groceryItemSchema);
