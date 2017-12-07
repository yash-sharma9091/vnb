'use strict';

const   mongoose  = require('mongoose'),
        path            = require('path'),
        config          = require(require(path.resolve('./config/env')).getEnv),
        Schema          = mongoose.Schema,

sectionSchema 	= new Schema({
    class_id:{
    	type: mongoose.Schema.Types.ObjectId
    },
    section_name: {
        type:String
    },
    section_code:{
        type:String
    },
    status:{
    	type:Boolean
    }
  
         
}, { timestamps : { createdAt: 'created_at' ,  updatedAt: 'updated_at'}});

module.exports = mongoose.model('section', sectionSchema);
