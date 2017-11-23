'use strict';

const   mongoose  = require('mongoose'),
        path            = require('path'),
        slug            = require('mongoose-slug-generator'),
        config          = require(require(path.resolve('./config/env')).getEnv);
        mongoose.plugin(slug);
const   Schema          = mongoose.Schema,

settingSchema 	= new Schema({
    banner_img : {
        type:Array
    },
    how_pencilink_works: {
        video_url: {
            type: String
        }    
    },
    what_we_do_steps:{
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
        },
        step4:{
            title: {
                type:String    
            },
            text: {
                type:String      
            }
        }
    },
    footer:{
        social_links:[
          {
            title:{
                type:String
            },
            url:{
                type:String
            },
            status:{
                type: Boolean,
                default: true
            }
          }
        ],
        copyright_text:{
            type:String
        }
    },
    type:String

       
}, { timestamps : { createdAt: 'created_at' ,  updatedAt: 'updated_at'}});

module.exports = mongoose.model('setting', settingSchema);
