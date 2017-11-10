'use strict';

const 
    mongoose        = require('mongoose'),
    path            = require('path'),
    config          = require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
    Schema          = mongoose.Schema,

FAQSchema   = new Schema({
    question: {
        type: String,
    },
    answer: {
        type: String,
    },
    order: {
        type: Number
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


module.exports = mongoose.model('FAQ', FAQSchema, 'faq');
