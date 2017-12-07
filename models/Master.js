'use strict';

const   mongoose  = require('mongoose'),
        path            = require('path'),
        config          = require(require(path.resolve('./config/env')).getEnv),
        Schema          = mongoose.Schema,

masterSchema 	= new Schema({
    school_level : {
        type:Object
    },
    school_type:{
        type:Object
    }
  
         
}, { timestamps : { createdAt: 'created_at' ,  updatedAt: 'updated_at'}});

module.exports = mongoose.model('masters', masterSchema);
