'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	FAQ         = require(path.resolve('./models/FAQ')),
	datatable 	= require(path.resolve('./config/lib/datatable')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
  	response    = require(path.resolve('./config/lib/response'));


exports.getFAQ = (req, res, next) => {

    FAQ.find({status:true}, 
    	function (error, result) {
    		if(error){
    			res.json(response.error(error));
    		}
    		res.json(response.success(result));
    	}
    ).sort({order:1});
};

