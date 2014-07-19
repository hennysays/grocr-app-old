var mongoose = require('mongoose');
var groceryUserSchema = mongoose.Schema({
		name: String,
		gender: String,
		appUseCount: Number, 
 		_id: Number
	});
module.exports = mongoose.model('GroceryUser',groceryUserSchema);
