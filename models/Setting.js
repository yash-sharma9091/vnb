'use strict';

const   mongoose  = require('mongoose'),
        path            = require('path'),
        config          = require(require(path.resolve('./config/env')).getEnv),
        Schema          = mongoose.Schema,

settingSchema 	= new Schema({

    banner_img : {
        type : Array
    },
    how_it_works: {
        video_url: {
            type: String
        },
        video_text: {
            type: String
        }    
    },
    site: {
        address:{
            type:String
        },
        fax:{
            type:String
        },
        phone:{
            type:String
        },
        domain:{
            type:String
        }    
    },
    simple_steps: {
        step1:{
            title: {
                type:String    
            },
            text: {
                type:String      
            }
        },
        step2:{
            title: {
                type:String    
            },
            text: {
                type:String      
            }
        },
        step3:{
            title: {
                type:String    
            },
            text: {
                type:String      
            }
        } 
    }
       
}, { timestamps : { createdAt: 'created_at' ,  updatedAt: 'updated_at'}});

module.exports = mongoose.model('setting', settingSchema);
