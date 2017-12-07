'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('config/lib/response')),
	User 		= require(path.resolve('models/User')),
	Teacher 	= require(path.resolve('models/Teacher')),
    MIRROR      = require(path.resolve('models/TeacherMirror')),
	GEO         = require(path.resolve('./config/lib/geoCoder')),
    ERROR       = require(path.resolve('./config/lib/error')),
	async 		= require('async'),
	fs 			= require('fs'),
	crypto 		= require('crypto'),
	csv 		= require('csvtojson'),
	_ 			= require('lodash'),
	mail 	 	= require(path.resolve('./config/lib/mail')),
	mongoose 	= require('mongoose'),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`));

/*Init Classes*/
let GEO_CODER = new GEO();

function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return (Math.floor(Math.random() * (max - min)) + min).toString(); 
};

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
	
	if( !req.body._id){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Id is required'}));
	}
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
       		delete req.body._id;
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
					message: 'Invalid field name(case sensitive), please download sample csv for proper format'
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
	  	    			 	errorStack.push("1 passed mandatory fields values");
	  	    			}
	  	    		    done(null, teacher, errorStack, errorQueue);	 
	  	    		},
  	    		    function(teacher, errorStack, errorQueue, done) {
                      /* Stage 2 - Validation against Job Address*/
                      GEO_CODER.LATLON(teacher.address, (ifFound)=>{
                        if(ifFound && ifFound.length && ifFound!=='No data found or invalid address'){
                          ifFound = ifFound[0];
                          /*if address found*/
                          /*now set google address object to teacher*/
                          let strComps = [];

                          if(ifFound.streetNumber) strComps.push(ifFound.streetNumber);
                          if(ifFound.streetName) strComps.push(ifFound.streetName);
                          if(ifFound.extra && ifFound.extra.subpremise) strComps.push("UNIT "+ifFound.extra.subpremise);
                          	teacher.address     = strComps.join(" ");
                            teacher.postal_code = ifFound.zipcode ? ifFound.zipcode : "";
                            teacher.country     = ifFound.country ? ifFound.country : "";
                            teacher.state 		= (ifFound.administrativeLevels && ifFound.administrativeLevels.level1long) ? ifFound.administrativeLevels.level1long : "";
                            teacher.city		= (ifFound.city) ? ifFound.city : "";
                            teacher.location	=  {
                                type : "Point",
                                coordinates : [ifFound.longitude,ifFound.latitude]
                            };

                          errorStack.push("2 passed address validation");
                        }else{
                          /*if address not found*/
                          errorStack.push("error");
                          errorQueue.push("Teacher address is not valid.");
                        }
                        done(null, teacher, errorStack, errorQueue);
                      });
                    }
	  	    	], function (err, results, stack, queue) {
                
                  if(stack.indexOf("error")>=0){
                    /*add a new mirror teacher*/
                    let newteacher = new MIRROR(teacher);
                    newteacher.save((err, saved) => {
                      if(err) {
                        counter += 1;
                        _ProcessesTeacher.push({name:teacher.first_name,status:"FAILED",error:ERROR.extract(err.message, ":"),stack:stack,queue:queue});
                      }else{
                        _ProcessesTeacher.push({name:teacher.first_name,status:"Drafted",stack:stack,queue:queue});
                      }
                      callback(false);
                    });
                  }else{
                    /*add a new teacher into main collection*/
                    let teacherStatus="Saved";
  
                    async.waterfall([
			            function saveInUser(done) {
          	      		  let password = getRandomInt(100,1000000);
          	      		  teacher.password=crypto.createHmac('sha512',config.salt).update(password).digest('base64');
			              let user= new User(teacher);
			                  user.save(function (err, user) {
			                if(err){
			                  done(err, null);
			                } else {
			                  done(null, user,password);
			                }
			              });
			            },
			            function saveInTeacher(user, password,done) {
			              teacher.user_id = user._id;
			              let teacherObj = new Teacher(teacher);
			               teacherObj.save(function (err, teacherresult) {
			                if(err){
			                  done(err, null);
			                } else {
			                  done(null, user,password);
			                }
			              });
			            },
			            function sendMailToTeacher(userresult,password,done) {
              	      		let mailsentmsg = "error";
              	      		console.log('pwd---'+password);
              	      		mail.send({
								subject: "Welcome to Pilot School's",
								html: './public/email_templates/user/teacher-signup.html',
								from: config.mail.from, 
								to: userresult.email_address,
								emailData : {
									contact_name: userresult.first_name,
									email_address: userresult.email_address,
									password: password
						  	    } 
							   }, (err, success) => {
								if(err){
								  console.log("err----"+JSON.stringify(err));
								   done(mailsentmsg,null);	
					               //User.update({ _id: pilotdata._id },{ $set: {pilot_request:pilotdata.pilot_request} }).exec();	
								} else {
									console.log("res----"+JSON.stringify(success));
									mailsentmsg="success";
		   						   done(null,mailsentmsg);	
								}
							});
			            }
			          ],function (err, teacherresult) {  
			              if(err) {
                             counter += 1;
                             _ProcessesTeacher.push({name:teacher.first_name,status:"FAILED",error:ERROR.extract(err.message, ":"),stack:stack,queue:queue,mailsent:teacherresult});
                          }else{
                             _ProcessesTeacher.push({name:teacher.first_name,status:teacherStatus,stack:stack,queue:queue,mailsent:teacherresult});
                        }
                       callback(false);
			        })
                  }
                });
            },
            // 3rd param is the function to call when everything's done
            (err) => {
              if(err) return res.status(412).json({type:"error",message:ERROR.oops(),errors:ERROR.pull(err)});
              return res.json({type:"success",message:(teacherArr.length-counter)+" out of "+(teacherArr.length)+" Teacher's imported successfully.",data:_ProcessesTeacher});
            }
          );
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
			let password = getRandomInt(100,1000000);
      		  userInputJson.password=crypto.createHmac('sha512',config.salt).update(password).digest('base64');
			let user= new User(userInputJson);
        	user.save(function (err, user) {
				if(err){
 					done(err, null);
				} else {
					done(null, user,password);
				}
			});
		},
		function saveInTeacher(user, password,done) {
			teacherInputJson.user_id = user._id;
			let teacher = new Teacher(teacherInputJson);
        	teacher.save(function (err, teacher) {
				if(err){
 					done(err, null);
				} else {
					done(null, user,password);
				}
			});
		},
        function sendMailToTeacher(userresult,password,done) {
      		mail.send({
				subject: "Welcome to Pilot School's",
				html: './public/email_templates/user/teacher-signup.html',
				from: config.mail.from, 
				to: userresult.email_address,
				emailData : {
					contact_name: userresult.first_name,
					email_address: userresult.email_address,
					password: password
		  	    } 
			   }, (err, success) => {
				if(err){
				   done({message:"we are facing some technical issue while sending email, please try after sometime."},null);	
	               //User.update({ _id: pilotdata._id },{ $set: {pilot_request:pilotdata.pilot_request} }).exec();	
				} else {
				   done(null,{message:"Mail sent successfully"});	
				}
		    });
	    }
	],function (err, teacher) {
		if(err){
		  reject(err);
		}
		resolve(teacher);
	})

  });
};