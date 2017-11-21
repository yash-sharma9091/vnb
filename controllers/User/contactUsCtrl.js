'use strict';

const 
	path 		= require('path'),
	response 	= require(path.resolve('config/lib/response')),
	async 		= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	mail 	 	= require(path.resolve('./config/lib/mail')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
	ContactUs= require(path.resolve('./models/ContactUs'));

exports.createContactUs = (req, res, next) => {
	if( !req.body.email || !req.body.phone ){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Email and Phone No are required'}));
	}
    
    let contactus = new ContactUs(req.body);
	contactus.save(function (err, result) {
		if( err ) {
			return res.json(response.error(err));
		}
		else{
			 mail.send({
				subject: "Pencil's INK Contact Us",
				html: './public/email_templates/admin/contactus.html',
				from: config.mail.from, 
				to: config.defaultAdmin.email_address,
				emailData : {
					email:result.email,
					name:result.name,
					phone:result.phone,
					question:result.question
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
					res.json(
						response.success({
						success: true, 
						message: 'Thank you for contacting us, We will contact you as soon as we review your message.'
					}));
				}
		     });
		}
	});
};