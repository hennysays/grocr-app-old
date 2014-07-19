
// Module dependencies
var newrelic 	= require('newrelic');
var express 	= require('express');
var mongoose 	= require ("mongoose");
var logfmt 		= require('logfmt');
var http		= require('http');
var path		= require('path');
var _ 		 	= require('underscore');
var passport	= require('passport');
var flash		= require('connect-flash');
var configDB	= require('./config/database.js');
var routes 		= require('./routes');
// var user 		= require('./routes/user');
var ping		= require('./routes/ping');

var app = express();

// Models
var groceryItemModel = require('./models/groceryItem');
var groceryItem2Model = require('./models/groceryItem2');
var groceryStoreModel = require('./models/groceryStore');
var groceryUserModel = require('./models/groceryUser');
var userModel = require('./models/user'); 
var orderModel = require('./models/order'); 

// Routes
var groceryItemRoutes = _.extend(require('./routes/groceryItem/add'),
		require('./routes/groceryItem/search'),
		require('./routes/groceryItem/search2'),
		require('./routes/groceryItem/searchAutoComplete'),
		require('./routes/groceryItem/update'),
		require('./routes/groceryItem/delete'));


var groceryItem2Routes = _.extend(require('./routes/groceryItem2/get'));

var groceryBasketItemRoutes = _.extend(require('./routes/groceryBasketItem/get'),
		require('./routes/groceryBasketItem/add'),
		require('./routes/groceryBasketItem/put'),
		require('./routes/groceryBasketItem/del'));

var orderRoutes = _.extend(require('./routes/order/get'),
		require('./routes/order/post'),
		require('./routes/order/put'),
		require('./routes/order/del'));



var groceryStoreRoutes = _.extend(require('./routes/groceryStore/searchAutoComplete'));

var groceryUserRoutes = _.extend(require('./routes/groceryUser/add'),
								 require('./routes/groceryUser/update'));

var userRoutes = _.extend(require('./routes/user/post'),
						  // require('./routes/user/put'),
						  require('./routes/user/get'),
						  require('./routes/user/getUserInfo'));
						  // require('./routes/user/del'));

// configuration
mongoose.connect(configDB.url, function (err, res) {
	if (err) { 
		console.log ('ERROR connecting to: ' + configDB.url + '. ' + err);
	} else {
		console.log ('Succeeded connected to: ' + configDB.url);
	}
});


require('./config/passport')(passport); // pass passport for configuration

// Configure for all environments
app.configure(function(){
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser());
	app.use(express.favicon());
	app.set('port', process.env.PORT || 5000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade'); // set up jade for templating
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	// app.use(function(err, req, res, next){
	// 	return next(err);
	// });

	// required for passport
	app.use(express.session({secret: 'leanstartup320'})); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(app.router);
});


app.configure('production',function() {
	console.log("PRODUCTION");
	process.env.NODE_ENV="production";
	app.use(express.static(path.join(__dirname, 'dist')));
});

// Configure for development only
app.configure('development',function() {
	console.log("DEVELOPMENT");
	process.env.NODE_ENV="development";
	app.use(express.errorHandler());
	app.use(express.static(path.join(__dirname, 'src')));
});

// Bootstrap routes
bootstrapRoutes(app);

// Launch
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('\nMongoose default connection disconnected through app termination');
		process.exit(0);
	});
});

function bootstrapRoutes(app) {
	app.post('/groceryItem/search', groceryItemRoutes.search);
	// app.get('/groceryItems', groceryItemRoutes.search2);
	app.get('/groceryItems', groceryItem2Routes.get);
	app.post('/groceryItem/searchAutoComplete', groceryItemRoutes.searchAutoComplete);
	app.post('/groceryStore/searchAutoComplete', groceryStoreRoutes.searchAutoComplete);
	app.post('/groceryItem/add', groceryItemRoutes.add);
	app.put('/groceryItem/update', groceryItemRoutes.update);
	app.del('/groceryItem/delete', groceryItemRoutes.delete);
	
	app.post('/groceryUser/add', groceryUserRoutes.add);
	app.put('/groceryUser/update', groceryUserRoutes.update);
	app.get('/ping', ping.ping);
	

	app.get('/', routes.index);


	app.get('/api/auth/isloggedin', isLoggedIn, function(req,res) {
		res.send(200,{success:true});
	});

	app.get('/api/auth/isAdmin', isAdmin, function(req,res) {
		res.send(200,{success:true});
	});


	app.get('/api/auth/logout', function(req,res) {
		req.logout();
		res.send(200,{success:true});
	});
	


	app.get('/groceryBasketItems', isLoggedIn, groceryBasketItemRoutes.get);
	app.post('/groceryBasketItems', isLoggedIn, groceryBasketItemRoutes.add);
	app.put('/groceryBasketItems/:id', isLoggedIn, groceryBasketItemRoutes.put);
	app.del('/groceryBasketItems/:id', isLoggedIn, groceryBasketItemRoutes.del);

	app.get('/orders', isAdmin, orderRoutes.get);
	app.post('/orders', isLoggedIn, orderRoutes.post);
	app.put('/orders/:id', isLoggedIn, orderRoutes.put);
	app.del('/orders/:id', isLoggedIn, orderRoutes.del);



	app.get('/users', isAdmin, userRoutes.get);
	app.get('/getUserInfo', isLoggedIn, userRoutes.getUserInfo);
	app.post('/users', isLoggedIn, userRoutes.post);

	// app.get('/users/:id', isLoggedIn, userRoutes.get);

	// app.post('/user', userRoutes.post);
	// app.put('/user', userRoutes.put);
	// app.get('/user', userRoutes.get);
	// app.del('/user', userRoutes.del);


	// Authentication routes
	app.post('/signup', function(req,res,next) {
		passport.authenticate('local-signup', function(err, user, info) {
				if(err) return next(err);
			    if (!user) { console.log(info); return res.send(500,info); }
			    req.logIn(user, function(err) {
			      if (err) { return next(err); }
			      return res.send(200,info);
			    });
		})(req,res,next);
	});

	app.post('/signin', function(req,res,next) {
		passport.authenticate('local-login', function(err, user, info) {
				if(err) return next(err);
			    if (!user) { console.log(info); return res.send(500,info); }
			    req.logIn(user, function(err) {
			      if (err) { return next(err); }
			      return res.send(200,info);
			    });
		})(req,res,next);
	});




function isLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {console.log("FAIL");res.send(200, {error: true});}
	else next();
}

function isAdmin(req,res,next) {
	console.log(req.user.isAdmin);
		if(req.user.isAdmin){
			next();
		}
		else {
			res.send(500,{success:false});	
		}


}

// app.get('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next);
// });


};



//function handleError(err,req,res,next) {
//console.log("HELLO WORLD");
//return next(err);
//}