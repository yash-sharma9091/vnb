'use strict';

var 
    mongoose        = require('mongoose'),
    path            = require('path'),
    slug            = require('mongoose-slug-generator'),
    config          = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));
    mongoose.plugin(slug);
var    Schema          = mongoose.Schema,

CMSSchema   = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    }, 
    slug: { 
        type: String, 
        slug: "title",
        unique:true 
    },
    meta_title: {
        type: String
    },
    meta_description: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('cms', CMSSchema, 'cms');
