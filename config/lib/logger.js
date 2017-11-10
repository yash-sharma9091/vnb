'use strict';

const _ 	= require('lodash'),
path     	= require('path'),
mongoose  = require('mongoose'),
config 	 	= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
fs 		   	= require('fs'),
winston  	= require('winston');

// list of valid formats for the logging
let validFormats = ['combined', 'common', 'dev', 'short', 'tiny'];

// Instantiating the default winston application logger with the Console
// transport
let logger = new winston.Logger({
	transports: [
	new winston.transports.Console({
		level: 'info',
		colorize: true,
		showLevel: true,
		handleExceptions: true,
		humanReadableUnhandledException: true
	}),
      /*new(winston.transports.MongoDB)({
          db : config.db.URL,
      })*/
      ],
      exitOnError: false
  });

// A stream object with a write function that will call the built-in winston
// logger.info() function.
// Useful for integrating with stream-related mechanism like Morgan's stream
// option to log all HTTP requests to a file
logger.stream = {
	write: function(msg) {
		logger.info(msg);
	}
};

/**
 * Instantiate a winston's File transport for disk file logging
 *
 */
 logger.setupFileLogger = function setupFileLogger() {

 	let fileLoggerTransport = this.getLogOptions();
 	if (!fileLoggerTransport) {
 		return false;
 	}

 	try {
  	// Check first if the configured path is writable and only then
  	// instantiate the file logging transport
  	if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
  		logger.add(winston.transports.File, fileLoggerTransport);
  	}

  	return true;
  } catch (err) {

  	return false;
  }
};

/**
 * The options to use with winston logger
 *
 * Returns a Winston object for logging with the File transport
 */
 logger.getLogOptions = function getLogOptions() {

 	let _config = _.clone(config, true);
 	let configFileLogger = _config.log.fileLogger;

 	if (!_.has(_config, 'log.fileLogger.directoryPath') || !_.has(_config, 'log.fileLogger.fileName')) {
 		console.log('unable to find logging file configuration');
 		return false;
 	}

  	// create directory if not exists
  	checkDirectorySync(configFileLogger.directoryPath);
  	let logPath = `${configFileLogger.directoryPath}/${configFileLogger.fileName}`;

  	return {
  		level: 'debug',
  		colorize: true,
  		filename: logPath,
  		timestamp: true,
  		maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
  		maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
  		json: (_.has(configFileLogger, 'json')) ? configFileLogger.json : false,
  		eol: '\n',
  		tailable: true,
  		showLevel: true,
  		handleExceptions: true,
  		humanReadableUnhandledException: true
  	};

  };

/**
 * The options to use with morgan logger
 *
 * Returns a log.options object with a writable stream based on winston
 * file logging transport (if available)
 */
 logger.getMorganOptions = function getMorganOptions() {

 	return {	
 		stream: logger.stream
 	};

 };

/**
 * The format to use with the logger
 *
 * Returns the log.format option set in the current environment configuration
 */
 logger.getLogFormat = function getLogFormat() {
 	let format = config.log && config.log.format ? config.log.format.toString() : 'combined';

  	// make sure we have a valid format
  	if (!_.includes(validFormats, format)) {
  		format = 'combined';
  	}

  	return format;
  };

/*
* check if required logs directory exists or not
*/
function checkDirectorySync(directory) {  
	try {
		fs.statSync(directory);
	} catch(e) {
		fs.mkdirSync(directory);
	}
}

logger.setupFileLogger();

/* Check mongoose debug level */
if(config.db.DEBUG === false && config.db.log === true){
  mongoose.set('debug', function(collectionName, methodName, query, doc){
    logger.log('info','mongoose:',`${collectionName}.${methodName}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
  });
}

module.exports = logger;