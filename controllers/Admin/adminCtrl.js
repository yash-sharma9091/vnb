'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('config/lib/response')),
	User 		= require(path.resolve('models/User')),
	//Setting 	= require(path.resolve('models/Setting')),
	_ 			= require('lodash'),
	jwt 	 	= require('jsonwebtoken'),
	async		= require('async'),
	crypto      = require('crypto'),
	mail 	 	= require(path.resolve('./config/lib/mail')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`));

exports.register = (req, res, next) => {
	User.count({email_address: config.defaultAdmin.email_address}, (err, count) => {
		if(err){
			return console.log(err);
		}
		
		if(count === 0){
			let user = new User(config.defaultAdmin);
			user.save()
			.then(user => console.log('New Admin created') )
			.catch(err => console.log(err));
		}	
	});	
};

exports.login = (req, res, next) => {
	if( !req.body.email || !req.body.password ){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Email and Password is required'}));
	}
	
	User.findOne({ email_address: req.body.email }, {reset_password: 0, salt: 0},(err, user, next) => {
		if(err){
			res
			.json(response.error(err));
		} else {
			let errors = {}, error = false;
			switch(_.isNull(user) || !_.isNull(user)){
				// 1. IF User Not Found in Database
				case _.isNull(user):
					errors = { message: 'Please enter valid user id & password'};
					error = true;
					break;

				// 3. IF Admin has Deactivate User Account
				case (!user.status):
					errors = { message: 'Your account is deactivated by admin, please contact admin.'};
					error = true;
					break;

				default: 
					error = false;
			}
			
			if(error){
				res
				.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.error(errors))
			} else {
				if(user.comparePassword(config.salt, req.body.password)){
					// Remove sensitive data before sending user object
					user.password = undefined;
					let token = jwt.sign(user, new Buffer(config.secret).toString('base64'), {expiresIn: '1 day'});
					res.json({user: user, token});
				} else {
					res
					.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
					.json(response.error({message: 'Authentication failed! Wrong Password'}));
				}
			}
		}
	});
};

exports.forgotpassword= (req,res,next) => {

 if(!req.body.email) {
	    return res.json({responsedata: {
	        message: 'Email is required', 
	        name: 'Authentication failed', 
	        success: 0} 
	      });
	  }
  let email = req.body.email,
  tmpEmail = _.escapeRegExp(req.body.email);

  async.waterfall([
    function (done) {
      User.findOne({ role:"admin",email_address: {$regex: new RegExp(`^${tmpEmail}`), $options:"im"}}, function (err, user) {
        if( err ){
          done(err, null);
        } else {
          let responsedata = null, error = false;
          switch(_.isNull(user) || !_.isNull(user)){
            case _.isNull(user):
              responsedata = {name:'Authentication failed', message:'Sorry! We weren\'t able to identify your email',success:0};
              error = true;
              break;
              
              default: 
              error = false;  
          }
          done(responsedata, user);
        }
      });
    },
	function (user, done) {
		crypto.randomBytes(20, function (err, buffer) {
			let token = buffer.toString('hex');
        	done(err, user, token);
      	});
    },
    function (user, token, done) {
		User.update(
			{_id: user._id},
			{ reset_password: { token: token, timestamp: Date.now() + 86400000, status: true} },
			function(err, result){
				done(err, token, user, result);
			}
		);
    },
    function (token,user, done) {
      let baseUrl = `${req.protocol}://${req.headers.host}`;
      let changePasswordLink=`${baseUrl}/adminapi/reset/${token}`;
		mail.send({
			subject: 'Virtual-Notebook Forgot Password',
			html: './public/email_templates/admin/forgotpassword.html',
			from: config.mail.from, 
			to: user.email_address,
			emailData : {
				changePasswordLink: changePasswordLink
	  	    }
		}, (err, success) => {
			if(err){
				res.status(500).json(
					response.error({
						source: err,
						message: 'Failure sending email',
						success: false
					})
		        );
			} else {
				res.json({
					success: true, 
					message: 'An email has been sent to the provided email with further instructions.'
				});
			}
		});
    }
  ], function (err, result) {
    if(err){
      return res.json({responsedata:{name:"error",status:0,message:err.message}});
    }
      return res.json({responsedata:{name:"success",status:1,message:result}});
  });
}
/**
 * Reset password GET from email token
 */
exports.validateResetToken = (req, res, next) => {
	User.count({ "reset_password.token": req.params.token, "reset_password.timestamp": { $gt: Date.now() }, "reset_password.status": true } , function(err, user){
    	if(user === 0){
    		if(process.env.NODE_ENV === 'test'){
    			return res.sendStatus(400);
    		}
    		return res.redirect('/invalid');
    	} else {
	    	if(process.env.NODE_ENV === 'test'){
				return res.sendStatus(200);
			}
			res.redirect(`http://localhost:${config.server.PORT}/#!/resetpassword/${req.params.token}`);	
    	}
    });
};
/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
	async.waterfall([
		function(done){
			User.findOne(
				{ "reset_password.token": req.params.token, "reset_password.timestamp": { $gt: Date.now() }, "reset_password.status": true }, 
				{email_address: 1, password: 1, reset_password: 1},
				function(err, user){
					if(err) {done(err,null);} 
					else{
					  if(user){
						user.password = req.body.password;
						user.reset_password = {
							status: false
						};
						user.save(function(err, saved){
							if(err){
								return next(err);
							} else {
								// Remove sensitive data before return authenticated user
	                    		user.password = undefined;
								res.json(
									response.success({
										success: true,
										message: 'Password has been changed successfully.'
									})	
								);
								done(err, user);
							}
						});
					} else {
						res.status(400).json(
							response.error({
								source: err,
								success: false,
				        		message: 'Password reset token is invalid or has been expired.'	
							})
				        );
					 }	
					}
				}
			);	
		},
		function(user, done){
			mail.send({
				subject: 'Your password has been changed',
				html: './public/email_templates/admin/reset-password-confirm.html',
				from: config.mail.from, 
				to: user.email_address
			},done);
		}
	], function (err) {
		if (err) {
			return next(err);
		}
	});
};

