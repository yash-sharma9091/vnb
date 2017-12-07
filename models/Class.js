'use strict';

const   mongoose  = require('mongoose'),
        path            = require('path'),
        config          = require(require(path.resolve('./config/env')).getEnv),
        Schema          = mongoose.Schema,

classSchema 	= new Schema({
    class_name: {
        type:String
    },
    class_code:{
        type:String
    },
    status:{
    	type:Boolean
    }
  
         
}, { timestamps : { createdAt: 'created_at' ,  updatedAt: 'updated_at'}});

module.exports = mongoose.model('class', classSchema);
