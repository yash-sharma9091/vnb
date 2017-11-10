"use strict";

const nodemailer	= require('nodemailer'),
	path 			= require('path'),
	config      	= require(require(path.resolve('./config/env')).getEnv),
	sgTransport     = require('nodemailer-sendgrid-transport'),
	fs 				= require('fs'),
	template 		= require(path.resolve('./config/lib/template-render'));

// Send mail by GMAIL SMTP
function gmailSMTP(opt, cb) {
	var poolConfig = config.mail.poolConfig,
	transporter = nodemailer.createTransport(poolConfig);
	sendMailer(opt, transporter, cb);
}

// Using sendgrid SMTP
function sendgridSMTP(opt, cb) {
    var sendgrid     = config.sendgrid,
    transporter     = nodemailer.createTransport(sgTransport(sendgrid));
    sendMailer(opt, transporter, cb);
}

function sendMailer(opt, transporter, cb) {
	/*transporter.verify((error, success) => {
	   	if (error) {
	   		console.log("in transporter.verify-------"+error);
	        cb(error);
	   	} else {
	   		// setup email data with unicode symbols
	   		let mailOptions = {
	   		    from: opt.from || config.mail.from, // sender address
	   		    to: opt.to, // list of receivers
	   		    subject: opt.subject, // Subject line
	   		    html: template.render(fs.readFileSync(opt.html, 'utf-8'), null, opt.emailData), // html body
	   		}; 
	   		// send mail with defined transport object
	   		transporter.sendMail(mailOptions, (error, info) => {
	   		    if (error) {
	   		    	console.log("in sendmailer -errror-------"+error);
	   		        cb(error);
	   		    } else {
	   		    	console.log("in sendmailer --------"+info);
	   		    	cb(null, info);
	   		    }
	   		});
	   	}
	});*/

	// setup email data with unicode symbols
	let mailOptions = {
	    from: opt.from || config.mail.from, // sender address
	    to: opt.to, // list of receivers
	    subject: opt.subject, // Subject line
	    html: template.render(fs.readFileSync(opt.html, 'utf-8'), null, opt.emailData), // html body
	}; 
	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        cb(error);
	    } else {
	    	cb(null, info);
	    }
	});
}

exports.send = function (opt, cb) {
    if (process.env.NODE_ENV === 'test') {
        stubMail(opt, cb);
    } else {
        if (config.mailTransporter === 'sendgrid'){
            sendgridSMTP(opt, cb);
        } else if (config.mailTransporter === 'gmail') {
            gmailSMTP(opt, cb);
        } else {
            cb('Unknown transporter, check your config', null);
        }
    }
};
