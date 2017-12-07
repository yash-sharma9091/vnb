'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('config/lib/response')),
	User 		= require(path.resolve('models/User')),
	Student 	= require(path.resolve('models/Student')),
	async 		= require('async'),
	fs 			= require('fs'),
	crypto 		= require('crypto'),
	csv 		= require('csvtojson'),
	_ 			= require('lodash'),
	mail 	 	= require(path.resolve('./config/lib/mail')),
	mongoose 	= require('mongoose'),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`));


exports.addStudent= (req, res, next) => {

    if( !req.body._id){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Id is required'}));
	}
    let image = {}, _body = req.body;
   
	if( req.files) {
		if(req.files.length > 0){
		  req.files.forEach(x => {
			image.name = x.filename;
			image.path = x.path;
			image.original_name = x.originalname;
		  });
		}
	}
  
	if( _.isEmpty(image) ) {
		image.original_name=config.image_name;
		image.path=config.image_path;
		image.name=config.image_path;
	} 
	_body = _.assign(req.body, {profile_image: image});	

    if(!_.isUndefined(_body.lng) || !_.isUndefined(_body.lat)){
		_body.location={
		    type       : "Point",
            coordinates: [_body.lng, _body.lat]
		};
		_body.school_id=req.body._id;
		delete _body._id;
    }
 	saveStudent(_body).then(result =>{
       res.json(response.success({message:"Student saved successfully."})); 
 	}).catch(err => {
 		return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR).json(err);
 	});
};

function saveStudent(_body){
 	
 return new Promise((resolve, reject) => {
    _body.role='student';
	async.waterfall([
		function saveInUser(done) {
			let user= new User(_body);
        	user.save(function (err, userresult) {
				if(err){
 					done(err, null);
				} else {
					done(null, userresult);
				}
			});
		},
		function saveInStudent(userresult, done) {
			_body.user_id = userresult._id;
			let student = new Student(_body);
        	student.save(function (err, studentresult) {
				if(err){
 					done(err, null);
				} else {
					done(null, studentresult);
				}
			});
		}
	],function (err, result) {
		if(err){
		  reject(err);
		}
		resolve(result);
	})

  });
 	
};

exports.getStudent = (req, res, next) => {
	let _id=req.query._id,datalimit=req.query.limit || 5;
	if( !_id){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Id is required.'}));
	}

 	User.aggregate([
	   {
	      $match:{"school_id": mongoose.Types.ObjectId( _id) }
	   },
	   {
	      $lookup:
	        {
	            from: "students",
	            localField: "_id",
	            foreignField: "user_id",
	            as: "student_data"
	        }
	   },
       {
	      $unwind: "$student_data"
	   },
	   {
	   	  $project:{ _id:1,
	   	  			 first_name:1,
	   	  			 last_name:1,
	   	  			 gender:1,
	   	  			 email_address:1,
	   	  			 contact_telephoneno:1,
	   	  			 profile_image:1,
	   	   			 'dob':'$student_data.dob',
	   	   			 'admission_date':'$student_data.admission_date',
	   	   			 'grade':'$student_data.grade',
	   	   			 'student_code':'$student_data.student_code',
	   	   			 'parent_name':'$student_data.parent_name',
	   	   			 'parent_relation':'$student_data.parent_relation',
   			 	     'address':"$student_data.address",
	   	   	         'country':"$student_data.country",
	   	   	         'state':"$student_data.state",
	   	   	         'city':"$student_data.city",
	   	   	         'postal_code':"$student_data.postal_code"
	   				}
	   },
	   {
	   	 $sort:{_id:-1}
	   },
	   {
	   	 $limit: datalimit
	   }
	],function(err,teacherresult){
	  	if(err){
		   return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR).json(err);
		}
		res.json(response.success(teacherresult));
	});	
};  	