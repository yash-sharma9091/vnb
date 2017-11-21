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
		function findSettingData(done) {
			Setting.findOne({type:{$ne:"footer"}},{_id:0})
			.then(response => done(null, response))
			.catch(err => done(err,null));
		},
		function findCMSData(settingdata, done) {
		   	CMS.find({},{_id:0,slug:1,title:1})
			.then(cmsresponse => done(null, settingdata,cmsresponse))
			.catch(err => done(err,null)); 
		},
		function findFooterData(settingdata,cmsdata, done){
           	Setting.findOne({type:"footer"},{_id:0,footer:1})
			.then(footerresponse => {
				settingdata.cms=cmsdata;
				settingdata.footer=footerresponse.footer;
				let fnlresult={
					banner_img:settingdata.banner_img,
                    how_pencilink_works: settingdata.how_pencilink_works,
                    what_we_do_steps:settingdata.what_we_do_steps,
                    cms_content:cmsdata,
					footer:footerresponse.footer
				};

                //console.log("settingdata"+settingdata);
                //console.log("cmsdata"+cmsdata);
                console.log("footer"+JSON.stringify(fnlresult));
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