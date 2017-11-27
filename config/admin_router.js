'use strict';
const path 	= require('path'),
_ 			= require('lodash'),
multer 		= require('multer'),
config 		= require(require(path.resolve('./config/env')).getEnv),
fs 			= require('fs');

/* Require All the controllers */
let ctrls = {};
fs.readdirSync(path.resolve('./controllers/Admin')).forEach(file => {
	let name = file.substr(0,file.indexOf('.js'));
	ctrls[name] = require(path.resolve(`./controllers/Admin/${name}`));
});

let uploadImage = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/blog/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
      }
    }),
    fileFilter: fileFilter
    
});

let uploadHomepageBanner = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/homepage_banner/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
      }
    }),
    fileFilter: fileFilter
    
});

let uploadTestimonialImage = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
    	destination: 'assets/testimonial/',
    	filename: function (req, file, cb) {
    		cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
  		}
    }),
    fileFilter: fileFilter
    
});

let uploadProfileImage = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
    	destination: 'assets/profile_image/',
    	filename: function (req, file, cb) {
    		cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
  		}
    }),
    fileFilter: fileFilter
});


/* Check if file is valid image */
function fileFilter (req, file, cb) {
	if(!_.includes(config.allowed_image_extensions, file.mimetype)){
		cb(new Error('Invalid image file'));
	}
	cb(null, true);
}


module.exports = {
  	routes: [
  		{ url: '/login', method: ctrls.adminCtrl.login, type: 'post' },
      { url: '/forgotpassword', method: ctrls.adminCtrl.forgotpassword, type: 'post' },
      { url: '/reset/:token', method: ctrls.adminCtrl.validateResetToken, type: 'get' },
      { url: '/reset_password/:token', method: ctrls.adminCtrl.reset, type: 'post' },
      { url: '/user/list', method: ctrls.userCtrl.list, type: 'post' },
      //{ url: '/user/add', mwear:uploadProfileImage.any(),method: ctrls.userCtrl.add, type: 'post' },
      { url: '/user/view/:id', method: ctrls.userCtrl.view, type: 'get' },
      //{ url: '/user/edit/:id', mwear: uploadProfileImage.any(), method: ctrls.userCtrl.edit, type: 'put' },
      { url: '/approverejectsingle', method: ctrls.userCtrl.approverejectsingle, type: 'post' },
  		{ url: '/cms/add', method: ctrls.cmsCtrl.add, type: 'post' },
      { url: '/cms/list', method: ctrls.cmsCtrl.list, type: 'post' },
      { url: '/cms/edit', method: ctrls.cmsCtrl.edit, type: 'put' },
      { url: '/cms/view/:slug', method: ctrls.cmsCtrl.view, type: 'get' },
      { url: '/sociallink/add', method: ctrls.socialLinkCtrl.add, type: 'post' },
      { url: '/sociallink/list', method: ctrls.socialLinkCtrl.list, type: 'post' },
      { url: '/sociallink/edit', method: ctrls.socialLinkCtrl.edit, type: 'put' },
      { url: '/sociallink/view/:_id', method: ctrls.socialLinkCtrl.view, type: 'get' },
      { url: '/whatdosteps/add', method: ctrls.whatDoStepCtrl.add, type: 'post' },
      { url: '/whatdosteps/list', method: ctrls.whatDoStepCtrl.list, type: 'post' },
      { url: '/whatdosteps/edit', method: ctrls.whatDoStepCtrl.edit, type: 'put' },
      { url: '/whatdosteps/view/:slug', method: ctrls.whatDoStepCtrl.view, type: 'get' },
      { url: '/homepage/edit', mwear:uploadHomepageBanner.any(),method: ctrls.homepageCtrl.edit, type: 'post' },
      { url: '/homepage/view', method: ctrls.homepageCtrl.view, type: 'get' },
      { url: '/homepage/bannerthumb', mwear:uploadHomepageBanner.any(),method: ctrls.homepageCtrl.bannerThumb, type: 'post' },
     
      { url: '/blog/add', mwear: uploadImage.any(), method: ctrls.blogCtrl.add, type: 'post' },
  		{ url: '/blog/list', method: ctrls.blogCtrl.list, type: 'post' },
  		{ url: '/blog/view/:slug', method: ctrls.blogCtrl.view, type: 'get' },
      { url: '/faq/add', method: ctrls.faqCtrl.add, type: 'post' },
  		{ url: '/faq/list', method: ctrls.faqCtrl.list, type: 'post' },
  		{ url: '/faq/edit', method: ctrls.faqCtrl.edit, type: 'put' },
  		{ url: '/faq/view/:id', method: ctrls.faqCtrl.view, type: 'get' },
  		{ url: '/testimonial/add', mwear: uploadTestimonialImage.any(), method: ctrls.testimonialCtrl.add, type: 'post' },
  		{ url: '/testimonial/list', method: ctrls.testimonialCtrl.list, type: 'post' },
  		{ url: '/testimonial/view/:id', method: ctrls.testimonialCtrl.view, type: 'get' },
       
	]
};