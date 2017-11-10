'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	Testimonial	= require(path.resolve('./models/Testimonial')),
	datatable 	= require(path.resolve('./config/lib/datatable')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./config/lib/paginate'));

exports.add = (req, res, next) => {
	if(!req.body.name ) {
		res.status(422).json({
			errors: {
				message: 'Name is required', 
				success: false,
			}	
		});
		return;
	}
	let reqData = req.body;
	if(req.files.length > 0){
		let image = {};
		req.files.forEach((file) => {
			image.name = file.filename;
			image.original_name = file.originalname;
			image.path = file.path;
		});
		
		reqData.image = image;	
	} else {
		delete reqData.image
	}
	
	
	if( reqData._id ){
		edit(reqData, res, next);
	} else {
		let testimonial = new Testimonial(reqData);
		testimonial.save()
		.then(result => res.json({success: true}))
		.catch(error => res.json({errors: error}));	
	}
    
};

function edit (reqData, res, next)  {
	
    Testimonial.update(
    	{_id: reqData._id},
    	{$set: reqData }, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true});
    	}
    );
};

exports.view = (req, res, next) => {
	if(!req.params.id) {
		res.status(422).json({
			errors: {
				message: 'id is required', 
				success: false,
			}	
		});
		return;
	}	 
    
    Testimonial.aggregate([
    	{
    		$match: { _id: mongoose.Types.ObjectId( req.params.id ) }
    	},
    	{
    		$project: {
    			description: 1,
    			name: 1,
    			image: "$image.path",
    			created_at: 1,
    			updated_at: 1,
    			status: 1
    		}
    	}
    ], 
	function (error, result) {
		if(error){
			res.json({errors: error});
		}
		res.json({success: true, result: result[0]});
	});
};

exports.list = (req, res, next) => {
	
	let operation = {}, reqData = req.body;
	if( reqData.name ){
		operation.name = {$regex: new RegExp(`${reqData.name}`), $options:"im"};
	}
	if( reqData.status === "true" || reqData.status === "false" ){
		operation.status = reqData.status == "true" ? true : false;
	}

	if( reqData.from_date || reqData.to_date ) {
		operation.created_at = {$gte: reqData.from_date, $lte: reqData.to_date };
	}
	
	async.waterfall([
		function (done) {
			if( reqData.customActionType === 'group_action' ) {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				
				if( reqData.customActionName === 'inactive' || reqData.customActionName === 'active' ){
					let _status =  ( reqData.customActionName === 'inactive' ) ? false : true;
					Testimonial.update({_id: {$in:_ids}},{$set:{status: _status}},{multi:true}, done);	
				} else if(reqData.customActionName === 'delete') {
					Testimonial.remove({_id: {$in:_ids}}, done);	
				}	
				
			} else {
				done(null, null);
			}
		},
		function (data, done) {
			async.parallel({
				count: (done) => {
					Testimonial.count(operation,done);
				},
				records: (done) => {
					Testimonial.find(operation,done);	
				}
			}, done);	
		}
	], (err, result) => {
		if(err){
			return res.json({errors: err});
		}
		let status_list = {
			class: {
				true : "info",
				false : "danger"	
			},
			status: {
				true : "Active",
				false : "InActive"	
			}
		};
		
		let dataTableObj = datatable.testimonialTable(status_list, result.count, result.records, reqData.draw);
		res.json(dataTableObj);
	});
};