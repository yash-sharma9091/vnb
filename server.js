'use strict';
require('dotenv').config({silent: true});
/*
* All the required node packages
*/
const express 	= require('express'),
	app 		= express(),
	path 		= require('path'),
	bodyParser 	= require('body-parser'),
	morgan 		= require('morgan'),
	mongoose 	= require('mongoose'),
	helmet 		= require('helmet'),
	compress 	= require('compression'),
	cors 		= require('cors'),
	logger 		= require(path.resolve('./config/lib/logger')),
	routes 		= require(path.resolve('./config/routes')),
	Admin 		= require(path.resolve('./controllers/Admin/adminCtrl')),
	config 		= require(require(path.resolve('./config/env')).getEnv),
	http 		= require('http').Server(app);


/*
mongodb connection
*/
mongoose.Promise = global.Promise;
mongoose.set('debug', config.db.DEBUG);
mongoose.connect(config.db.URL, config.db.options);
let conn = mongoose.connection; 
conn.on('error', console.error.bind(console, 'connection error:'));

/**
enable cors
*/
app.use(cors());	

/* Node.js compression middleware
* The middleware will attempt to compress response bodies for all request that traverse through the middleware
* Should be placed before express.static
*/
app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
}));

/*
* Serving static files in Express using express static middleware
* these files will be access publicly
*/


if( process.env.NODE_ENV === 'development' ){
	//app.use(express.static(path.resolve('./public')));
} else {
	app.use(express.static(path.resolve('./build')));	
}
app.use(express.static(path.resolve('./admin')));
app.use('/assets', express.static(path.resolve('./assets')));


/*
* uncomment the following when the favicon is available
* Initialize favicon middleware
*/
// app.use(favicon(`${__dirname}/public/images/favicon.ico`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));

/**
* Configure Helmet headers configuration
* Use helmet to secure Express headers
*/
app.use(helmet());
/* Register all your routes */
app.use('/api', routes.router);
app.use('/adminapi', routes.admin);

if(process.env.NODE_ENV === 'production'){
	app.get(/^((?!\/(api|adminapi|admin)).)*$/, function (req, res) {
		res.sendFile(path.resolve('./build/index.html'));
	});
}
app.get(/^((?!\/(adminapi)).)*$/, function (req, res) {
	res.sendFile(path.resolve('./admin/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
	if(err){
		logger.log('error', err);
		res.status(err.status || 500).json({
			errors: {
				source: err.errors || err,
				code: err.code,
				message: err.message || 'Some error occurred, try after sometime!!',
				success: false
			},
			message: err.message || 'Some error occurred, try after sometime!!',
			status: 2
		});
	}
	next();
});

/*
* Start the node server using node 'http' package
*/
conn.once('open', function() {
	http.listen(config.server.PORT, () => {
		Admin.register();
	    console.log(`Listening on server port:${config.server.PORT}`);
	});
});	


/*
* we need app package for tests so we are exporting this for our tests
*/
module.exports = app;