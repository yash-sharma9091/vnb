'use strict';

const   mongoose  = require('mongoose'),
        path            = require('path'),
        slug            = require('mongoose-slug-generator'),
        config          = require(require(path.resolve('./config/env')).getEnv);
        mongoose.plugin(slug);
const   Schema          = mongoose.Schema,

settingSchema 	= new Schema({
    banner_img : {
        type:Object
    },
    banner_text:{
        type:String
    },
    video_url: {
        type: String
    },
    title: {
        type:String    
    },
    text: {
        type:String      
    },
    short_description: {
        type:String    
    },
    long_description: {
        type:String      
    },
    url:{
        type:String
    },
    status:{
        type: Boolean,
        default: true
    },
    copyright_text:{
            type:String
    },
    type:{
        type:String    
    },
    slug:{
        type: String, 
        slug: "title",
        unique:true 
    },
    order:{
        type:Number
    },
    join_pilot_study:{
        type:String
    }
         
}, { timestamps : { createdAt: 'created_at' ,  updatedAt: 'updated_at'}});

module.exports = mongoose.model('setting', settingSchema);
