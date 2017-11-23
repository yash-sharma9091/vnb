'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	Setting     = require(path.resolve('./models/Setting')),
	datatable 	= require(path.resolve('./config/lib/datatable')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./config/lib/paginate'));

exports.add = (req, res, next) => {
	let reqData=req.body;
	if(!req.body.title ) {
		res.status(422).json({
			errors: {
				message: 'Title  is required', 
				success: false,
			}	
		});
		return;
	}	 
    
    Setting.update({type: "footer"},{$push: {"footer.social_links": reqData}})
        .then(result => res.json({success: true}))
        .catch(error => res.json({errors: error}));
};

exports.edit = (req, res, next) => {
	if(!req.body._id) {
		res.status(422).json({
			errors: {
				message: 'Id is required', 
				success: false,
			}	
		});
		return;
	}	 
  let reqData=req.body;
    
    Setting.update({type: "footer","footer.social_links._id": req.body._id},
    	           {$set: { "footer.social_links.$.title": reqData.title, "footer.social_links.$.url": reqData.url,"footer.social_links.$.status":reqData.status }}, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true});
    	}
    );
};

exports.view = (req, res, next) => {
	if(!req.params._id) {
		res.status(422).json({
			errors: {
				message: 'Id is required', 
				success: false,
			}	
		});
		return;
	}	 
        
    Setting.findOne({type:"footer","footer.social_links._id":req.params._id},{ "footer.social_links.$": 1},   
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true, result: result.footer.social_links[0]});
    	}
    );
};

exports.list = (req, res, next) => {
	
	let operation = {type:"footer"}, reqData = req.body;

	async.waterfall([
		function (done) {
		
			if( reqData.customActionType === 'group_action' && reqData.customActionName === 'remove') {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				Setting.remove({"footer.social_links._id": {$in:_ids}},done);
			} 
			else if( reqData.customActionType === 'group_action' ) {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				let _status =  ( reqData.customActionName === 'inactive' ) ? false : true;
				Setting.update({"footer.social_links._id": {$in:_ids}},{$set:{"footer.social_links.$.status": _status}},{multi:true}, done);
			} 
			else {
				done(null, null);
			}
		},
		function (data, done) {
			async.parallel({
				count: (done) => {
					Setting.count(operation,done);
				},
				records: (done) => {
					Setting.find(operation,{_id:0,"footer.social_links":1},done);	
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

		let dataTableObj = datatable.socialLinkTable(status_list, result.count, result.records[0].footer.social_links, reqData.draw);
		res.json(dataTableObj);
	});
};