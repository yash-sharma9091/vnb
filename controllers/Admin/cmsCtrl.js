'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	CMS         = require(path.resolve('./models/CMS')),
	datatable 	= require(path.resolve('./config/lib/datatable')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./config/lib/paginate'));

exports.add = (req, res, next) => {
	if(!req.body.title ) {
		res.status(422).json({
			errors: {
				message: 'Title  is required', 
				success: false,
			}	
		});
		return;
	}	 
    
    let cms = new CMS(req.body);
    cms.save()
    .then(result => res.json({success: true}))
    .catch(error => res.json({errors: error}));
};

exports.edit = (req, res, next) => {
	if(!req.body.slug) {
		res.status(422).json({
			errors: {
				message: 'Slug is required', 
				success: false,
			}	
		});
		return;
	}	 
  let reqData=req.body;
    
    CMS.update({slug: req.body.slug},{$set: { title: reqData.title, slug: reqData.slug, description: reqData.description, meta_title:reqData.meta_title,meta_description:reqData.meta_description }}, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true});
    	}
    );
};

exports.view = (req, res, next) => {
	if(!req.params.slug) {
		res.status(422).json({
			errors: {
				message: 'Slug is required', 
				success: false,
			}	
		});
		return;
	}	 
    
    
    CMS.findOne({slug: req.params.slug}, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true, result: result});
    	}
    );
};

exports.list = (req, res, next) => {
	
	let operation = {}, reqData = req.body;
	if( reqData.title ){
		operation.title = {$regex: new RegExp(`${reqData.title}`), $options:"im"};
	}

	if( reqData.description ){
		operation.description = {$regex: new RegExp(`${reqData.description}`), $options:"im"};
	}
	if( reqData.meta_title ){
		operation.meta_title = {$regex: new RegExp(`${reqData.meta_title}`), $options:"im"};
	}
    if( reqData.meta_description ){
		operation.meta_description= {$regex: new RegExp(`${reqData.meta_description}`), $options:"im"};
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
				let _status =  ( reqData.customActionName === 'inactive' ) ? false : true;
				CMS.update({_id: {$in:_ids}},{$set:{status: _status}},{multi:true}, done);
			} else {
				done(null, null);
			}
		},
		function (data, done) {
			async.parallel({
				count: (done) => {
					CMS.count(operation,done);
				},
				records: (done) => {
					CMS.find(operation,done);	
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
		
		let dataTableObj = datatable.cmsTable(status_list, result.count, result.records, reqData.draw);
		res.json(dataTableObj);
	});
};