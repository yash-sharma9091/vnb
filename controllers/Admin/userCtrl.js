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
    		result.pilot_request=`<span class="label label-sm label-${status_list.class[result.pilot_request]}">${status_list.status[result.pilot_request]}</span>`
    		res.json({success: true, result: result});
    	}
    );
};

exports.list = (req, res, next) => {
	let operation = { role: "schooladmin" }, reqData = req.body;
    let sorting  = datatable.sortingDatatable(req.body.columns,req.body.order);
    sorting.created_at=-1;

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
	if( reqData.pilot_request){
		operation.pilot_request = {$regex: new RegExp(`${reqData.pilot_request}`), $options:"im"};
	}
	
	async.waterfall([
		function (done) {
			if( reqData.customActionType === 'group_action' ) {

				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				let _status =  ( reqData.customActionName === 'Approve' ) ? 'Approved' : 'Rejected';

				if(_status=="Rejected"){
				  User.update({_id: {$in:_ids}},{$set:{pilot_request: _status}},{multi:true}, done);
				}
				else{
			  		createUniqueAccount(_ids)
			  		.then(response =>{
				       async.each(response, function(elem, callback) {
				          async.waterfall([
	                        function(done){
	                          let updateJson={},password= getRandomInt(100,1000000);;
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
	                        function(pilotdata,callback){
				             
                        		mail.send({
									subject: 'Virtual-Notebook Request Approved',
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
								       done(err,null);
									} else {
						               done(null,success);
									}
								});

	                        }
	                      ],callback);
			           },function(err,res){
			           	 if(err){
			           	 	done(err,null);
			           	 }
			           	 else{
			           	 	done(null,res);
			           	 }
			           });
	                })
			  		.catch(err =>{
					   done(err,null);
					});	
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


function createUniqueAccount(userid){
   	return new Promise((resolve, reject) => {
	  if( !userid ) return reject('Id is required');
	    async.waterfall([
	    	function createSequence(done){

              User.find({email_address:{$ne:"admin@gmail.com"},pilot_request:"Approved"},(err,userseq) =>{
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

function shortSchoolType(type){
   switch(type)
	{
	    case 'Public':
	        return 'P';
	        break;
	    case 'Charter':
	        return 'C';
	        break;
	    case 'Private':
	        return 'R';
	        break;
	    case 'Parochia':
	    	return 'A';
	        break;
	    case 'Other':
	 		return 'O';
	        break;
	}
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