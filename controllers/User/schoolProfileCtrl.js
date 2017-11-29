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
	if( !_.isUndefined(req.files)) {
		if(req.files.length > 0){
		  req.files.forEach(x => {
			 image.name = x.filename;
			 image.path = x.path;
			 image.original_name = x.originalname;
		  });
		}

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
	}
	async.waterfall([
		function (done) {
			User.findOneAndUpdate(
				{ _id: _body._id },
				{$set:_body},
				{ runValidators: true, setDefaultsOnInsert:true,context: 'query' },
				done
			);
		},
		function (result, done) {
			User.findOne({_id: _body._id},{seq_no:0,salt:0,password:0,reset_password:0,email_verified:0,role:0,password:0, salt: 0}, done);
		}
	],function (err, user) {
			if(err){
				return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR).json(err);
			}
			res.json(response.success(user));
		}
	)
};