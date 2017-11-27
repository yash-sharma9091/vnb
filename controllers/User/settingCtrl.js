'use strict';

const 
	path 		= require('path'),
	response 	= require(path.resolve('config/lib/response')),
	async 		= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	mail 	 	= require(path.resolve('./config/lib/mail')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
	CMS         = require(path.resolve('./models/CMS')),
	Setting     = require(path.resolve('./models/Setting'));

exports.settingHomepage = (req, res, next) => {
    
   	async.waterfall([
		
		function findCMSData(done) {
		   	CMS.find({},{_id:0,slug:1,title:1})
			.then(cmsresponse => done(null,cmsresponse))
			.catch(err => done(err,null)); 
		},
		function findStepsData(cmsdata, done) {
		   	Setting.find({type:"whatdostep"},{_id:0,title:1,short_description:1,order:1,slug:1})
			.then(stepresponse => done(null,cmsdata,stepresponse))
			.catch(err => done(err,null)); 
		},
		function findHomepageData(cmsdata,stepdata, done) {
		   	Setting.findOne({type:"homepage"},{_id:0,type:0,updated_at:0,status:0})
			.then(homeresponse => done(null,cmsdata,stepdata,homeresponse))
			.catch(err => done(err,null)); 
		},

		function findSocialData(cmsdata,stepdata,homeresponse, done){
           	Setting.find({type:"social"},{_id:0,created_at:0,updated_at:0,type:0,status:0,banner_img:0,__v:0})
			.then(socialresponse => {
				homeresponse.banner_img.text=homeresponse.banner_text;
				let fnlresult={
					banner_img:homeresponse.banner_img,
					thumb:homeresponse.thumb,
                    how_pencilink_works: {video_url:homeresponse.video_url},
                    what_we_do_steps:stepdata,
                    cms_content:cmsdata,
				    social_links:socialresponse,
				    copyright_text:homeresponse.copyright_text,
				    join_pilot_study:homeresponse.join_pilot_study
				};

				done(null, fnlresult);
			 })
			.catch(err => done(err,null)); 
		}
	], function (err,result) {
		if(err) return res.status(response.STATUS_CODE.INTERNAL_SERVER_ERROR)
						  .json(err);
		res.json(response.success(result));

	});
};