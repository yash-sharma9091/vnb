'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('config/lib/response')),
	User 		= require(path.resolve('models/User')),
	async 		= require('async'),
	crypto 		= require('crypto'),
	_ 			= require('lodash'),
	mail 	 	= require(path.resolve('./config/lib/mail')),
	mongoose 	= require('mongoose'),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


exports.schoolProfileStep1 = (req, res, next) => {
	let image = {}, _body;
	if( req.files.length > 0 ) {
		req.files.forEach(x => {
			image.name = file.filename;
			image.path = x.path;
			image.original_name = x.originalname;
		});
	}
	if( !_.isEmpty(image) ) {
		_body = _.assign(req.body, {school_logo: image});	
	} else {
		_body = req.body;
		if(!_.isUndefined(_body.country) || !_.isUndefined(_body.state) || !_.isUndefined(_body.city)){
			_body.address={
				country:_body.country,
				state  :_body.state,
				city   :_body.city,
				postal_code:_body.postal_code
		   };
		}
        if(!_.isUndefined(_body.lng) || !_.isUndefined(_body.lat)){
    		_body.location={
			    type       : "Point",
                coordinates: [_body.lng, _body.lat]
			};
        }
	
		_body.school_logo.original_name="default-logo.png";
		_body.school_logo.path="assets/schoolprofile_image/default-logo.png"

	}
	async.waterfall([
		function (done) {
			User.update(
				{ _id: _body._id },
				{$set:_body},done);
		},
		function (result, done) {
			User.findOne({_id: _body._id},{password:0, salt: 0}, done);
		}
	],function (err, user) {
			if(err){
				return res.json(response.error(err));
			}
			res.json(response.success(user));
		}
	)
};