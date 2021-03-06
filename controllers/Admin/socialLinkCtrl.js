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
	    reqData.type="social";
	if(!req.body.title ) {
		res.status(422).json({
			errors: {
				message: 'Title  is required', 
				success: false,
			}	
		});
		return;
	}	 
    let setting = new Setting(req.body);
    setting.save()
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

  Setting.update({type:"social",_id: req.body._id},{$set: { title: reqData.title,url: reqData.url,status:reqData.status }}, 
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
        
    Setting.findOne({type:"social",_id: req.params._id}, 
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
	let operation = {type:"social",$or: [ { title: regexsearch },{url:regexsearch}]};

	async.waterfall([
		function (done) {
		
			if( reqData.customActionType === 'group_action' && reqData.customActionName === 'remove') {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				Setting.remove({_id: {$in:_ids}},done);
			} 
			else if( reqData.customActionType === 'group_action' ) {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				let _status =  ( reqData.customActionName === 'inactive' ) ? false : true;
				Setting.update({_id: {$in:_ids}},{$set:{status: _status}},{multi:true}, done);
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
					Setting.find(operation,done).skip(start).limit(length);	
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
		
		let dataTableObj = datatable.socialLinkTable(status_list, result.count, result.records, reqData.draw);
		res.json(dataTableObj);
	});
};