
var mongoose = require ("mongoose");
var GroceryItem  = mongoose.model('GroceryItem');

exports.add = function(req, res) {
	var item = req.body.item;	
	req.user.basket.push(item);
	req.user.save(function(err,user) {
		if(err) {
			res.send(500, {message:"failure'"})
		}
		else {
			res.send(200,{message: "success"});
		}
	});


	// req.user.populate('basket.item',function(err,user){
	// 	console.log("TEST \n" + item);
	// });
	// GroceryItem.findById(test.item).populate().
	// console.log("TESTING\n" + test.populate("basket.item"));
	// 	test = req.body;
	// 	// console.log("TESTING blah blah");
	// 	console.log(test);
	// 	req.user.basket.push({
	// 		quantity: test.quantity,
	// 		item: test.item
	// 	});
	// req.user.save(function(err){
	// 	if(err) {
	// 		console.log(err);
	// 	}
	// 	else {
	// 		console.log("TESTING\n" + req.user.basket[1].lean());
	// 	}
	// });
	
	
}

