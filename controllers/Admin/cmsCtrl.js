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
    
    CMS.update({slug: req.body.slug},{$set: { title: reqData.title, slug: reqData.slug, description: reqData.description, meta_title:reqData.meta_title,meta_description:reqData.meta_description,status:reqData.status }}, 
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
	
	let reqData = req.body,length = Number(reqData.length),
	start = Number(reqData.start);
	let regexsearch={$regex: new RegExp(`${reqData.search.value}`), $options:"im"};
	let operation = {$or: [ { title: regexsearch },{meta_title:regexsearch},{meta_description:regexsearch}]};

	async.waterfall([
		function (done) {
		
			if( reqData.customActionType === 'group_action' && reqData.customActionName === 'remove') {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				CMS.remove({_id: {$in:_ids}},done);
			} 
			else if( reqData.customActionType === 'group_action' ) {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				let _status =  ( reqData.customActionName === 'inactive' ) ? false : true;
				CMS.update({_id: {$in:_ids}},{$set:{status: _status}},{multi:true}, done);
			} 
			else {
				done(null, null);
			}
		},
		function (data, done) {
			async.parallel({
				count: (done) => {
					CMS.count(operation,done);
				},
				records: (done) => {
					CMS.find(operation,done).skip(start).limit(length);	
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