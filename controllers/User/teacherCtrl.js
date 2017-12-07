'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('config/lib/response')),
	User 		= require(path.resolve('models/User')),
	Teacher 	= require(path.resolve('models/Teacher')),
	async 		= require('async'),
	fs 			= require('fs'),
	crypto 		= require('crypto'),
	csv 		= require('csvtojson'),
	_ 			= require('lodash'),
	mail 	 	= require(path.resolve('./config/lib/mail')),
	mongoose 	= require('mongoose'),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`));

function GetFilename(url)
{
   if (url)
   {
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1)
      {
         return m[1];
      }
   }
   return "";
}


exports.addTeacher= (req, res, next) => {

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
    }
 	saveTeacher(_body).then(result =>{
       res.json(response.success({message:"Teacher saved successfully."})); 
 	}).catch(err => {
 		return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR).json(err);
 	});
};

exports.getTeacher = (req, res, next) => {
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
	            from: "teachers",
	            localField: "_id",
	            foreignField: "user_id",
	            as: "teacher_data"
	        }
	   },
       {
	      $unwind: "$teacher_data"
	   },
	   {
	   	  $project:{ _id:1,
	   	  			 first_name:1,
	   	  			 last_name:1,
	   	  			 gender:1,
	   	  			 email_address:1,
	   	  			 contact_telephoneno:1,
	   	  			 profile_image:1,
	   	   			 'teacher_code':'$teacher_data.teacher_code',
	   	   			 'joining_date':'$teacher_data.joining_date',
	   	   			 'department_name':'$teacher_data.department_name',
 	   	   			 'designation':'$teacher_data.designation',
	   	   			 'qualification':'$teacher_data.qualification',
	   	   			 'experience':'$teacher_data.experience',
	   	   			 'grade':'$teacher_data.grade',
	   	   			 'subject':'$teacher_data.subject',
	   	   			 'official_grade':"$teacher_data.official_grade",
   			 	     'address':"$teacher_data.address",
	   	   	         'country':"$teacher_data.country",
	   	   	         'state':"$teacher_data.state",
	   	   	         'city':"$teacher_data.city",
	   	   	         'postal_code':"$teacher_data.postal_code"
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

/*	teacherObj.hasOwnProperty("department_name")===true &&
	teacherObj.hasOwnProperty("designation")===true &&
	teacherObj.hasOwnProperty("qualification")===true &&
	teacherObj.hasOwnProperty("experience")===true &&
	teacherObj.hasOwnProperty("grade")===true &&
	teacherObj.hasOwnProperty("subject")===true */

exports.addBulkTeacherInCsv = (req, res, next) => {
	
	/*if( !req.body._id){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Id is required'}));
	}*/
	const csvFilePath=req.files[0].path,teacherArr=[];
	let checkField=false;
   
	csv()
	.preFileLine((fileLineString, lineIdx)=>{
		if (lineIdx === 1){
			 
				return fileLineString.replace('profile image','profile_image')
				                     .replace('first name','first_name')
				                     .replace('last name','last_name')
				                     .replace('email address','email_address')
				                     .replace('contact telephoneno','contact_telephoneno')
		}
		return fileLineString
	})
	.fromFile(csvFilePath)
	.on('json',(teacherObj)=>{

		if( teacherObj.hasOwnProperty("first_name")===true && 
			teacherObj.hasOwnProperty("last_name")===true && 
			teacherObj.hasOwnProperty("gender")===true &&
			teacherObj.hasOwnProperty("email_address")===true && 
			teacherObj.hasOwnProperty("contact_telephoneno")===true &&
			teacherObj.hasOwnProperty("address")===true)
		{
       		teacherObj.school_id = req.body._id;
			teacherObj.role = "teacher";
			teacherObj.joining_date = new Date();
		    teacherArr.push(teacherObj);
		}
		else{
			checkField=true;
		}
	})
	.on('done',(error)=>{
		if(checkField==true){
			return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR).json(response.error({
					success: 0, 
					message: 'Invalid file format, please download sample csv for proper format'
			}));
		}
		else{
			let counter = 0, _ProcessesTeacher=[], status=true;	
	  	    fs.unlinkSync(csvFilePath);
	  	    async.eachSeries(teacherArr,(teacher,callback) => {
	  	    	let errorStack = [], errorQueue=[];
	  	    	//---------WATERFALL start for validating uploaded CSV----------
	  	    	async.waterfall([
	  	    		function(done){
	  	    			 /*Stage 1 - Validataion against required fields*/
	  	    			if(    !teacher.first_name || !teacher.last_name 
	  	    			 	 || !teacher.gender || !teacher.email_address
	  	    			 	 || !teacher.contact_telephoneno || !teacher.address){

	  	    			 	errorStack.push("error");
                            errorQueue.push("Missing mandatory fields values found.");
	  	    		    }else{
	  	    			 	errorStack.push("passed function 1");
	  	    			}
	  	    		    done(null, teacher, errorStack, errorQueue);	 
	  	    		}
	  	    	])
	  	    })
         console.log("arr----"+JSON.stringify(teacherArr));
         return;
         //res.json(response.success({message:"Teacher list has been saved successfully"})); 
		}
	 })
};


function saveTeacher(_body){
 	
 return new Promise((resolve, reject) => {
    var userInputJson={
       first_name:_body.first_name,
       last_name:_body.last_name,
       gender:_body.gender,
       email_address:_body.email_address,
       contact_telephoneno:_body.contact_telephoneno,
       role:'teacher',
       school_id: _body._id,
       profile_image:_body.profile_image
	};

	var teacherInputJson={
       teacher_code:_body.teacher_code,
       joining_date: _body.joining_date,
       department_name:_body.department_name,
       designation:_body.designation,
       qualification:_body.qualification,
       experience:_body.experience,
       grade:_body.grade,
       subject:_body.subject,
       official_grade:_body.official_grade,
       school_id: _body._id,
       address:_body.address,
       country:_body.country,
       state:_body.state,
       city:_body.city,
       postal_code:_body.postal_code,
       location:_body.location
	};

	async.waterfall([
		function saveInUser(done) {
			let user= new User(userInputJson);
        	user.save(function (err, user) {
				if(err){
 					done(err, null);
				} else {
					done(null, user);
				}
			});
		},
		function saveInTeacher(user, done) {
			teacherInputJson.user_id = user._id;
			let teacher = new Teacher(teacherInputJson);
        	teacher.save(function (err, teacher) {
				if(err){
 					done(err, null);
				} else {
					done(null, teacher);
				}
			});
		}
	],function (err, teacher) {
		if(err){
		  reject(err);
		  //return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR).json(err);
		}
		resolve(teacher);
		//res.json(response.success({message:"Teacher saved successfully."}));
	})

  });
 	
};