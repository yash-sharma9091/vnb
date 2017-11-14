'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	crypto      = require('crypto'),
	User 	 	= require(path.resolve('./models/User')),
	mail 	 	= require(path.resolve('./config/lib/mail')),
	datatable 	= require(path.resolve('./config/lib/datatable')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./config/lib/paginate'));


function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return (Math.floor(Math.random() * (max - min)) + min).toString(); 
  };
var status_list = {
			class: {
				"Approved" : "success",
				"Rejected" : "danger",
				"Pending"  : "info"	
			},
			status: {
				"Approved" : "Approved",
				"Rejected" : "Rejected",
				"Pending"  : "Pending"
			}
		};
exports.add = (req, res, next) => { 

 req.body.password=crypto.createHash('md5').update(getRandomInt()).digest("hex");
    let user = new User(req.body);
       user.save(function(err, user) {
         if(err)next(err);
		   res.json({
	          responsedata:{
	            message:"user signup successfully",
	            user:user,
	            success:1
	          }    
   	       })
	  });
};

exports.edit = (req, res, next) => {
	if(!req.params.id) {
		res.status(422).json({
			errors: {
				message: 'id is required', 
				success: false,
			}	
		});
		return;
	}
    User.update({_id: req.params.id},{$set: req.body}, 
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
    
    
    User.findOne({_id: req.params.id}, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		result.status=`<span class="label label-sm label-${status_list.class[result.status]}">${status_list.status[result.status]}</span>`
    		res.json({success: true, result: result});
    	}
    );
};

exports.list = (req, res, next) => {
	let operation = { role: "schooladmin" }, reqData = req.body;
    let sorting  = datatable.sortingDatatable(req.body.columns,req.body.order);

	if( reqData.contact_name ){
		operation.contact_name = {$regex: new RegExp(`${reqData.contact_name}`), $options:"im"};
	}
	if( reqData.contact_telephoneno ){
		operation.contact_telephoneno = {$regex: new RegExp(`${reqData.contact_telephoneno}`), $options:"im"};
	}
	if( reqData.school_name ){
		operation.school_name = {$regex: new RegExp(`${reqData.school_name}`), $options:"im"};
	}
	if( reqData.school_type ){
		operation.school_type = {$regex: new RegExp(`${reqData.school_type}`), $options:"im"};
	}
	if( reqData.school_level ){
		operation.school_level = {$regex: new RegExp(`${reqData.school_level}`), $options:"im"};
	}
	if( reqData.no_of_students ){
		operation.no_of_students = reqData.no_of_students;
	}
	if( reqData.status){
		operation.status = {$regex: new RegExp(`${reqData.status}`), $options:"im"};
	}
	
	async.waterfall([
		function (done) {
			if( reqData.customActionType === 'group_action' ) {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				let _status =  ( reqData.customActionName === 'Approve' ) ? 'Approved' : 'Rejected';
				User.update({_id: {$in:_ids}},{$set:{status: _status}},{multi:true}, done);
			}
			else {
				done(null, null);
			}
		},
		function (data, done) {
			async.parallel({
				count: (done) => {
					User.count(operation,done);
				},
				records: (done) => {
					User.find(operation,done).sort(sorting);	
				}
			}, done);	
		}
	], (err, result) => {
		if(err){
			return res.json({errors: err});
		}
		
		
		let dataTableObj = datatable.userTable(status_list, result.count, result.records, reqData.draw);
		res.json(dataTableObj);
	});
};