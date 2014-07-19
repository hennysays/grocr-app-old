var mongoose = require ("mongoose");
var GroceryItem = mongoose.model('GroceryItem');
var GroceryStore = mongoose.model('GroceryStore');

exports.add = function(req, res) {
    req.setEncoding('utf8');
    var item = req.body;
    var store = item.store;
  
    // If store is new
    var newStore = new GroceryStore ({
                  name: store.name,
                  street: store.street,
                  city: store.city,
                  province: store.province,
                  country: store.country,
                  lat: store.lat,
                  lng: store.lng,
                  id: store._id
    });

    newStore.save(function (err) {
    if (err) console.log('Error on save!');
        else {
            var newItem = new GroceryItem ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        units: item.units,
                        image: item.image,
                        store: newStore._id
            });  
            newItem.save(function (err) {
                if (err) console.log('Error on save!');
            });
        }
    }); 

      res.send('Add Grocery Items');
}