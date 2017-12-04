'use strict';
const path 	 	= require('path'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	Setting 	= require(path.resolve('models/Setting')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./config/lib/paginate'));

exports.edit = (req, res, next) => {
	let image = {};
	if(req.files.length > 0){
		req.files.forEach((file) => {
			image.name = file.filename;
			image.original_name = file.originalname;
			image.path = file.path;
		});
     req.body.banner_img = image;	
	} else {
;		delete req.body.banner_img;
	}
    Setting.update({_id:req.body._id,type:"homepage"},{$set:req.body})
    .then(result => res.json({success: true}))
    .catch(error => res.json({errors: error}));

};

exports.view = (req, res, next) => {
   Setting.findOne({type:"homepage"}, 
    	function (error, result) {
    		if(error){
    			return res.json({errors: error});
    		}
    		res.json({success: true, result: result});
    	}
    );
};

exports.bannerThumb = (req,res,next) => {
		let image = {};
	if(req.files.length > 0){
		req.files.forEach((file) => {
			image.name = file.filename;
			image.original_name = file.originalname;
			image.path = file.path;
		});
     req.body.thumb = image;	
	} else {
		delete req.body.thumb
	}
   Setting.update({_id:req.body._id,type:"homepage"},{$set:req.body})
    .then(result => res.json({success: true}))
    .catch(error => res.json({errors: error}));
};

