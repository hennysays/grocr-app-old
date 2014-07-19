var mongoose = require ("mongoose");
var GroceryUser = mongoose.model('GroceryUser');

exports.update = function(req, res) {
    req.setEncoding('utf8');
    var id= req.body.id;
    GroceryUser.findById(id, function (err, user) {
        if (err) console.log('error on find');
        else {
            user.appUseCount++;
            user.save(function (err) {
            if (err) return console.log('error on save');
                console.log("App use counter incremented");
                res.send("SUCCESS");
            });
        }
    });

}