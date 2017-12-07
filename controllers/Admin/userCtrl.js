'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	crypto      = require('crypto'),
	response 	= require(path.resolve('config/lib/response')),
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
const isJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

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
    
    User.aggregate([
		   {
		      $match: {_id: mongoose.Types.ObjectId(req.params.id)}
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
		   	  	    _id:1,
		   	  	    contact_title:"$school_data.contact_title",
		   	   	    contact_name:"$school_data.contact_name",
		   	   	    email_address:1,
		   	   	    contact_telephoneno:1,
		   	   	    pilot_request:1,
		   	   	    reject_reason:1,
		   	   	    become_pilot_description:"$school_data.become_pilot_description",
		   	   	    school_name:"$school_data.school_name",
		   	   	    school_telephoneno:"$school_data.school_telephoneno",
		   	   	    school_address:"$school_data.school_address",
		   	   	    no_of_students:"$school_data.no_of_students",
		   	   	    school_type:"$school_data.school_type",
		   	   	    school_level:"$school_data.school_level",
		   	   	    school_code:"$school_data.school_code",
		   	   	    no_of_students_laptop:"$school_data.no_of_students_laptop",
		   	   	    school_challenges_lesson_planning:"$school_data.school_challenges_lesson_planning",
                  	school_challenges_teacher_gradebook:"$school_data.school_challenges_teacher_gradebook",
                  	school_challenges_students_classwork:"$school_data.school_challenges_students_classwork",
                  	school_goals_lesson_planning:"$school_data.school_goals_lesson_planning",
                  	school_goals_teacher_gradebook:"$school_data.school_goals_teacher_gradebook",
                  	school_goals_students_classwork:"$school_data.school_goals_students_classwork",
		   	  }
		   }

		],function(err,userresult){
			if(err){
				res.json({errors: error});
			}
			if(userresult){
			  if(userresult.length>0){
			  	let finalresult=userresult[0];
		  		finalresult.pilot_request_check=`<span class="label label-sm label-${status_list.class[finalresult.pilot_request]}">${status_list.status[finalresult.pilot_request]}</span>`;
	  			finalresult.school_level=isJson(finalresult.school_level) ? JSON.parse(finalresult.school_level) : finalresult.school_level;
	  			finalresult.school_type=isJson(finalresult.school_type) ? JSON.parse(finalresult.school_type) : finalresult.school_type;
			 
	            res.json({success: true, result: finalresult});
			  }	
		  }
	});
};

exports.list = (req, res, next) => {
	let reqData = req.body,length = Number(reqData.length),start = Number(reqData.start);
	let regexsearch={$regex: new RegExp(`${reqData.search.value}`), $options:"im"};
	let operation = {role: "schooladmin",$or: [ { contact_telephoneno: regexsearch },{email_address:regexsearch},
					{school_name:regexsearch},{school_address:regexsearch}]};
    //let sorting  = datatable.sortingDatatable(req.body.columns,req.body.order);
    //sorting.created_at=-1;

	async.waterfall([
		function (done) {
			if( reqData.customActionType === 'group_action' ) {

				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				let _status =  ( reqData.customActionName === 'Approve' ) ? 'Approved' : 'Rejected';

				if(_status=="Rejected"){
			   	   rejectPilotRequest(req,res,_ids,_status,reqData.reject_reason);		
				}
				else{
				   approvePilotRequest(req,res,_ids,_status);
				}
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
					//User.find(operation,done).sort(sorting).skip(start).limit(length);	

					 User.aggregate([
					   {
					      $match: operation
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
					   	  	    contact_title:"$school_data.contact_title",
					   	   	    contact_name:"$school_data.contact_title",
					   	   	    email_address:1,
					   	   	    contact_telephoneno:1,
					   	   	    pilot_request:1,
					   	   	    school_name:"$school_data.school_name",
					   	   	    school_address:"$school_data.school_address",
					   	   	    no_of_students:"$school_data.no_of_students",
					   	   	    school_type:"$school_data.school_type",
					   	   	    school_level:"$school_data.school_level",
					   	   	    school_code:"$school_data.school_code",
					   	   	    no_of_students:"$school_data.no_of_students"
					   	  }
					   },
					   { $sort  : {_id:-1} },
			   		   { $skip  : start   },
			   	       { $limit : length }

					],function(err,userresult){
						if(err){
							return done(err,null);
						}
						done(null,userresult);
					});
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

function approvePilotRequest(req,res,_ids,_status){
		createUniqueAccount(_ids)
  		.then(uanresponse =>{
	       async.each(uanresponse, function(elem, callback) {
	          async.waterfall([
                function(done){
                  let updateJson={},password= getRandomInt(100,1000000);
                      updateJson.uan=elem.uan;
                      updateJson.pilot_request=_status;
                      updateJson.password=crypto.createHmac('sha512',config.salt).update(password).digest('base64');
                      elem.password=password;
                  	  updateJson.seq_no=elem.seq_no;
                  User.update({ _id: elem._id },{ $set: updateJson },(err,res)=>{
                  	if(err){
                  		done(err,null);
                  	}
                  	else{
                  		done(null,elem);
                  	}
                  });
                },
                function(pilotdata,done){
	             
            		mail.send({
						subject: 'Pilot school approval confirmation',
						html: './public/email_templates/user/approve.html',
						from: config.mail.from, 
						to: pilotdata.email_address,
						emailData : {
							contact_name: pilotdata.first_name,
							email_address: pilotdata.email_address,
							username: pilotdata.uan,
							password: pilotdata.password
				  	    } 
					   }, (err, success) => {
						if(err){
						   done({message:"we are facing some technical issue while sending email, please try after sometime."},null);	
			               User.update({ _id: pilotdata._id },{ $set: {pilot_request:pilotdata.pilot_request} }).exec();	
						} else {
   						   done(null,{message:"Your pilot request has been rejected, I have send mail with reasons"});	
						}
					});
                }
              ],(err,eachresult) => {
              	if(err){
              		callback(err);
              	}
              	else{
              		callback();
              	}
              });
           },function(err,userres){
             if( err ) {
			   return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR).json(response.error(err));
		     }
		     res.json(response.success({message: 'Pilot request approved successfully'}));
           });
        })
  		.catch(err =>{
		   return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR).json(response.error(err));
		});	
}

function rejectPilotRequest(req,res,_ids,reject_status,reject_reason){
	async.waterfall([
		function findAllUser(done){
           User.find({_id: {$in:_ids}},done);
		},
		function updateStatus(users,done){
           if(!_.isEmpty(users) && users.length>0){
            async.each(users, function(rejectdata, callback) {
		          async.waterfall([
                    function rejectRequest(done){
                       User.update({ _id: rejectdata._id },
               	           { $set: {
               	           			pilot_request:reject_status,
               	           			reject_reason:reject_reason
               	                   } 
               	           },(err,res) => {
               	           	if(err){
               	           		done(err,null);
               	           	}
               	           	else{
               	           		done(null,rejectdata);
               	           	}
                       });
                    },
                    function sendRejectMail(rejectdata,done){
                 		mail.send({
							subject: 'Pilot school Reject confirmation',
							html: './public/email_templates/user/reject.html',
							from: config.mail.from, 
							to: rejectdata.email_address,
							emailData : {
								contact_name: rejectdata.first_name,
								email_address: rejectdata.email_address,
								reject_reason: rejectdata.reject_reason
					  	    } 
						   }, (err, success) => {
							if(err){
							 done({message:"we are facing some technical issue while sending email, please try after sometime."},null);	
   			                 User.update({ _id: rejectdata._id },{ $set: {pilot_request:rejectdata.pilot_request} }).exec();	
							} else {
 							 done(null,{message:"Your pilot request has been rejected, I have send mail with reasons"});	
  							}
						});
                    }
                  ],(err,result) =>{
                  	if(err){
                  	 callback(err);
                  	}
                  	else{
                     callback();		
                  	}
                  });
	           },function(err,userres){
	           	 if(err){
	           	 	done(err,null);
	           	 }
	           	 else{
	           	 	done(null,userres);
	           	 }
	        });	  
           }
           else {
				done(null, null);
		    }
		}
    ],(err,result) => {
    	if( err ) {
			return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR).json(response.error(err));
		}
		res.json(response.success({message: 'Pilot request reject successfully'}));
    })
}

function createUniqueAccount(userid){
   	return new Promise((resolve, reject) => {
	  if( !userid ) return reject('Id is required');
	    async.waterfall([
	    	function createSequence(done){

              User.find({role:{$ne:"superadmin"},pilot_request:"Approved"},(err,userseq) =>{
                 if(err){
                   done(err,null);	
                 }
                 else{
                   let uniqseq;
                   if(userseq.length!=0){
                   	 uniqseq=userseq[0].seq_no+1;
                   	 done(null,uniqseq);
                   }
                   else{
                     uniqseq=1;
                   	 done(null,uniqseq);
                   }
                 } 
              }).sort({_id:-1}).limit(1); 
	    	},
	        function getSchoolInfo(sequence,done){
  	          
			    User.aggregate([
					   {
					      $match: {$and:[{_id: {$in:userid}},{pilot_request:{$in:["Pending","Rejected"]}}]}
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
					   	   	    email_address:1,
					   	   	    first_name:1,
					   	   	    pilot_request:1,
					   	   	    created_at:1,
					   	   	    school_name:"$school_data.school_name",
					   	   	    no_of_students:"$school_data.no_of_students",
					   	   	    school_type:"$school_data.school_type",
					   	   	    school_level:"$school_data.school_level",
					   	  }
					   }
					],function(err,userresult){
						if(err){
							return done(err,null);
						}
						done(null,userresult,sequence);
				});
	        },
	        function uniqueAccountNo(user,sequence,done){
	          let uniqueAccArr=[],seqNo=0;	
	          user.map(function(singleuser){
	          	let fnlJson={},accountNo='';
	          	 if(singleuser.school_name!=""){
     	           accountNo=accountNo+'X'+singleuser.school_name.replace(/ /g,'').substring(0,3).toUpperCase();
	          	 }
                 if(singleuser.school_type!=undefined){
                   //accountNo=accountNo+ shortSchoolType(singleuser.school_type);
                   accountNo=accountNo+singleuser.school_type.abbreviation;
                 }
                 if(singleuser.created_at){
                   let month=new Date(singleuser.created_at).getMonth() +1;
                   let year =(new Date(singleuser.created_at).getFullYear()+'').substring(2,4);	
                   accountNo=accountNo+	month + year;
                 }
                 if(singleuser.no_of_students!=undefined){
                   accountNo=accountNo + noOfStudentDigit(singleuser.no_of_students);
                 }
                 if(sequence){
                 	if(sequence==1){
                 	  seqNo=seqNo+1;
                 	  sequence=("000"+seqNo).slice(-4);	
                      accountNo=accountNo+sequence;
                      singleuser.seq_no=seqNo;
                      singleuser.uan=accountNo;
                      uniqueAccArr.push(singleuser);
                 	}
                 	else{
                 	  let seqDigit=("000"+sequence).slice(-4);	
                      accountNo=accountNo+seqDigit;
                      singleuser.uan=accountNo;
                      singleuser.seq_no=sequence;
                      uniqueAccArr.push(singleuser);
                 	}
                 }
	          });	
  	          done(null,uniqueAccArr);
	        }
	    ],function(err,res){
	        if( err ) {
				reject(err);
			} else {
				resolve(res);
			}
	    })

	});
}

function noOfStudentDigit(digit){
    let studentlength= digit.toString().length;
	   switch(studentlength)
		{
		    case 1:
		        return "000"+digit;
		        break;
		    case 2:
		        return "00"+digit;
		        break;
		    case 3:
		    	return "0"+digit;
		        break;
		    case 4:
		 		return digit;
		        break;
		}
}

exports.approverejectsingle= (req,res,next) => {
	let reqData= req.body;
	if( !req.body._id ){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Id is required'}));
	}

	let _ids = [mongoose.Types.ObjectId(reqData._id)];
	let _status =  ( reqData.status === 'Approve' ) ? 'Approved' : 'Rejected';

	if(_status=="Rejected"){
        rejectPilotRequest(req,res,_ids,_status,reqData.reject_reason);
	}
	else{
		approvePilotRequest(req,res,_ids,_status);
	}


};