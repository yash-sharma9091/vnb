'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('config/lib/response')),
	User 		= require(path.resolve('models/User')),
	Teacher 	= require(path.resolve('models/Teacher')),
	School 	    = require(path.resolve('models/School')),
	async 		= require('async'),
	crypto 		= require('crypto'),
	_ 			= require('lodash'),
	mail 	 	= require(path.resolve('./config/lib/mail')),
	mongoose 	= require('mongoose'),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


exports.schoolProfileStep1 = (req, res, next) => {
	let image = {}, _body,nullimage={};

	if( !_.isUndefined(req.files)) {
		if(req.files.length > 0){
		  req.files.forEach(x => {
			 image.name = x.filename;
			 image.path = x.path;
			 image.original_name = x.originalname;
		  });
		}
	}
    if(_.isNull(req.body.image) || req.body.image==="null"){
		nullimage.original_name=config.default_school_logo.original_name;
		nullimage.path=config.default_school_logo.path;
		nullimage.name="";
		_body = _.assign(req.body, {school_logo: nullimage});
	}

	if( !_.isEmpty(image) ) {
		_body = _.assign(req.body, {school_logo: image});	
	} 
	else {
		_body = req.body;
        if(!_.isUndefined(_body.lng) || !_.isUndefined(_body.lat)){
    		_body.location={
			    type       : "Point",
                coordinates: [_body.lng, _body.lat]
			};
        }
	}
	async.waterfall([
		function (done) {
			School.findOneAndUpdate(
				{ user_id: _body._id },
				{$set:_body},
				{ runValidators: true, setDefaultsOnInsert:true,context: 'query' },
				done
			);
		}
	],function (err, user) {
			if(err){
				return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR).json(err);
			}
			res.json(response.success(user));
		}
	)
};

exports.getSchoolProfileStepData= (req,res,next) => {
	let _id=req.query._id;
	if( !_id){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Id is required.'}));
	}

	User.aggregate([
	   {
	      $match:{"_id": mongoose.Types.ObjectId(_id) }
	   },

	   {
	   	   $project:{
	   	   	    seq_no:0,
	   	   	    __v:0,
	   	   	    reset_password:0,
	   	   	    email_verified:0,
	   	   	    role:0,
	   	   	    password:0,
	   	   	    salt: 0
	   		}
	   },
       {
	      $lookup:
	        {
	            from: "schools",
	            localField: "_id",
	            foreignField: "user_id",
	            as: "school_data"
	        }
	   },
       {
	      $unwind: "$school_data"
	   },
	   {
	   	  $project:{
	   	  	    uan:1,
	   	  	    contact_title:"$school_data.contact_title",
	   	   	    contact_name:"$school_data.contact_title",
	   	   	    email_address:1,
	   	   	    contact_telephoneno:1,
	   	   	    school_telephoneno:"$school_data.school_telephoneno",
	   	   	    school_name:"$school_data.school_name",
	   	   	    no_of_students:"$school_data.no_of_students",
	   	   	    school_type:"$school_data.school_type",
	   	   	    school_level:"$school_data.school_level",
	   	   	    school_code:"$school_data.school_code",
	   	   	    no_of_students_laptop:"$school_data.no_of_students_laptop",
	   	   	    school_logo:"$school_data.school_logo",
	   	   	    address:"$school_data.address",
	   	   	    country:"$school_data.country",
	   	   	    state:"$school_data.state",
	   	   	    city:"$school_data.city",
	   	   	    postal_code:"$school_data.postal_code"
	   	  }
	   }

	],function(err,result){
		if(err){
			return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR).json(err);
		}
		if(result){
		  if(result.length>0){
		  	let finalresult=result[0];
	  		finalresult.school_type= isJson(finalresult.school_type) ? JSON.parse(finalresult.school_type) : finalresult.school_type;
	  		finalresult.school_level=isJson(finalresult.school_level) ? JSON.parse(finalresult.school_level) : finalresult.school_level;
	  		finalresult.school_logo=isJson(finalresult.school_logo) ? JSON.parse(finalresult.school_logo) : finalresult.school_logo;
	
		   res.json(response.success(finalresult));
		  }	
		}
	});
};

const isJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}