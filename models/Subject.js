'use strict';

const   mongoose  = require('mongoose'),
        path            = require('path'),
        config          = require(require(path.resolve('./config/env')).getEnv),
        Schema          = mongoose.Schema,

subjectSchema 	= new Schema({
    section_id:{
    	type: mongoose.Schema.Types.ObjectId
    },
    subject_name: {
        type:String
    },
    subject_code:{
        type:String
    },
    status:{
    	type:Boolean
    }
  
         
}, { timestamps : { createdAt: 'created_at' ,  updatedAt: 'updated_at'}});

module.exports = mongoose.model('subject', subjectSchema);
