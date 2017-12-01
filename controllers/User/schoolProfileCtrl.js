'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('config/lib/response')),
	User 		= require(path.resolve('models/User')),
	Teacher 	= require(path.resolve('models/Teacher')),
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
    if(_.isNull(req.body.image) || req.body.image==="null"){
		image.original_name=config.default_school_logo.original_name;
		image.path=config.default_school_logo.path;
		image.name="";
		_body = _.assign(req.body, {school_logo: image});
	}

	if( !_.isEmpty(image) ) {
		_body = _.assign(req.body, {school_logo: image});	
	} 
	else {
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
			User.findOne({_id: _body._id},{seq_no:0,reset_password:0,email_verified:0,role:0,password:0, salt: 0}, done);
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
	   	  $project:{
	   	  	    uan:1,
	   	  	    contact_title:1,
	   	   	    contact_name:1,
	   	   	    email_address:1,
	   	   	    contact_telephoneno:1,
	   	   	    school_telephoneno:1,
	   	   	    school_name:1,
	   	   	    school_address:1,
	   	   	    no_of_students:1,
	   	   	    school_type:1,
	   	   	    school_level:1,
	   	   	    school_code:1,
	   	   	    no_of_students_laptop:1,
	   	   	    school_logo:1,
	   	   	    //address:1,
	   	   	    country:"$address.country",
	   	   	    state:"$address.state",
	   	   	    city:"$address.city",
	   	   	    postal_code:"$address.postal_code",
    	   	    school_address: { $concat: [ "$address.city", " , ","$address.state"," , ", "$address.country" ] } 
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
		  	/*if(!_.isUndefined(finalresult.address.country) || !_.isUndefined(finalresult.address.state) || !_.isUndefined(finalresult.address.city) || !_.isUndefined(finalresult.address.postal_code)){
                finalresult.address=finalresult.address.city+ ','+ finalresult.address.state+ ','+finalresult.address.country+ ','+finalresult.address.postal_code;
            }*/
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