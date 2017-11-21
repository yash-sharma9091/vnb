'use strict';
const path  = require('path'),
_       = require('lodash'),
multer    = require('multer'),
config    = require(require(path.resolve('./config/env')).getEnv),
fs      = require('fs');

/* Require All the controllers */
let ctrls = {};
fs.readdirSync(path.resolve('./controllers/User')).forEach(file => {
  let name = file.substr(0,file.indexOf('.js'));
  ctrls[name] = require(path.resolve(`./controllers/User/${name}`));
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
      { url: '/signupSchool', method: ctrls.userCtrl.signupSchool, type: 'post' },
      { url: '/loginSchool', method: ctrls.userCtrl.loginSchool, type: 'post' },
      { url: '/verify_email/:salt', method: ctrls.userCtrl.verifyEmail, type: 'get' },
      { url: '/forgot_password', method: ctrls.userCtrl.forgot, type: 'post' },
      { url: '/reset/:token', method: ctrls.userCtrl.validateResetToken, type: 'get' },
      { url: '/reset_password/:token', method: ctrls.userCtrl.reset, type: 'post' },
      { url: '/change_password/:id', method: ctrls.userCtrl.changePassword, type: 'post' },
      { url: '/contactus',method: ctrls.contactUsCtrl.createContactUs, type: 'post' },
      { url: '/setting_homepage',method: ctrls.settingCtrl.settingHomepage, type: 'post' },
      { url: '/profile', mwear: uploadProfileImage.any(),method: ctrls.userCtrl.updateProfile, type: 'post' },
     
  ]
};