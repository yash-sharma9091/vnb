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
let uploadSchoolProfileImage = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/schoolprofile_image/',
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

let uploadTeacherCsv = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/teacher_uploadedcsv/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + config.csv_extensions[file.mimetype]);
      }
    }),
    fileFilter: csvFilter
});

let uploadStudentCsv = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/student_uploadedcsv/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + config.csv_extensions[file.mimetype]);
      }
    }),
    fileFilter: csvFilter
});

/* Check if file is valid csv */
function csvFilter (req, file, cb) {
  if(!_.includes(config.allowed_csv_extensions, file.mimetype)){
    cb(new Error('Invalid file, please upload a valid csv file'));
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
      { url: '/getfaq',method: ctrls.cmsCtrl.getFAQ, type: 'get' },
      { url: '/setting_homepage',method: ctrls.settingCtrl.settingHomepage, type: 'get' },
      { url: '/profilesetup_step1', mwear: uploadSchoolProfileImage.any(),method: ctrls.schoolProfileCtrl.schoolProfileStep1, type: 'post' },
      { url: '/addteacher', mwear: uploadProfileImage.any(),method: ctrls.teacherCtrl.addTeacher, type: 'post' },
      { url: '/addbulkteacher_csv', mwear: uploadTeacherCsv.any(),method: ctrls.teacherCtrl.addBulkTeacherInCsv, type: 'post' },
      { url: '/getteacher',method: ctrls.teacherCtrl.getTeacher, type: 'get' },
      { url: '/getschoolprofile_step',method: ctrls.schoolProfileCtrl.getSchoolProfileStepData, type: 'get' },
      { url: '/profile', mwear: uploadProfileImage.any(),method: ctrls.userCtrl.updateProfile, type: 'post' },
     
  ]
};