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
    		result.pilot_request_check=`<span class="label label-sm label-${status_list.class[result.pilot_request]}">${status_list.status[result.pilot_request]}</span>`;
    		res.json({success: true, result: result});
    	}
    ).lean();
};

exports.list = (req, res, next) => {
	let reqData = req.body,length = Number(reqData.length),start = Number(reqData.start);
	let regexsearch={$regex: new RegExp(`${reqData.search.value}`), $options:"im"};
	let operation = {role: "schooladmin",$or: [ { contact_telephoneno: regexsearch },{email_address:regexsearch},
					{school_name:regexsearch},{school_address:regexsearch}]};
    let sorting  = datatable.sortingDatatable(req.body.columns,req.body.order);
    sorting.created_at=-1;

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
					User.find(operation,done).sort(sorting).skip(start).limit(length);	
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
							contact_name: pilotdata.contact_name,
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
								contact_name: rejectdata.contact_name,
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

              User.find({role:{$ne:"admin"},pilot_request:"Approved"},(err,userseq) =>{
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
	        function getUserInfo(sequence,done){
  	          User.find({$and:[{_id: {$in:userid}},{pilot_request:{$in:["Pending","Rejected"]}}]},(err,user) => {
  	          	if(err){
  	          	  done(err,null);
  	          	}
  	          	else{
  	          	  if(user){
  	          	    done(null,user,sequence);
  	          	  }
  	          	  else{
                    done({message:"This is already approved."},null);
  	          	  }	
  	          	}
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

	let _ids = [reqData._id];
	let _status =  ( reqData.status === 'Approve' ) ? 'Approved' : 'Rejected';

	if(_status=="Rejected"){
        rejectPilotRequest(req,res,_ids,_status,reqData.reject_reason);
	/*  User.update({_id: {$in:_ids}},{$set:{pilot_request: _status}},(err,result) => {
	  	 if(err)next(err);	
        res.json(response.success({success: true, message:'Your request has been rejected by admin'}));
	  });*/
	}
	else{
		approvePilotRequest(req,res,_ids,_status);
  		/*createUniqueAccount(_ids)
  		.then(uanresult =>{
  	      let userUAN=uanresult[0]; 		
          async.waterfall([
            function(done){
              let updateJson={},password= getRandomInt(100,1000000);
                  updateJson.uan=userUAN.uan;
                  updateJson.pilot_request=_status;
                  updateJson.password=crypto.createHmac('sha512',config.salt).update(password).digest('base64');
                  userUAN.password=password;
              	  updateJson.seq_no=userUAN.seq_no;
              User.update({ _id: userUAN._id },{ $set: updateJson },(err,res)=>{
              	if(err){
              		done(err,null);
              	}
              	else{
              		done(null,userUAN);
              	}
              });
            },
            function(pilotdata,done){
             
        		mail.send({
					subject: "Pencl's INK approval confirmation",
					html: './public/email_templates/user/approve.html',
					from: config.mail.from, 
					to: pilotdata.email_address,
					emailData : {
						contact_name: pilotdata.contact_name,
						email_address: pilotdata.email_address,
						username: pilotdata.uan,
						password: pilotdata.password
			  	    } 
				   }, done);
            }
          ],function(err,result){
           	 if(err){
           	 	return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
						  .json(err);
           	 }
           	 else{
		        res.json(response.success({success: true, message:'Your request has been approved by admin'}));
           	 }
           });
   
        })
  		.catch(err =>{
		 	return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
						  .json(err);
		});	*/
	}


};