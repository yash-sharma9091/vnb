'use strict';

const mongoose 	= require('mongoose'),
path 			= require('path'),
config 			= require(require(path.resolve('./config/env')).getEnv),
uniqueValidator = require('mongoose-unique-validator'),
Schema 			= mongoose.Schema,

TestimonialSchema 	= new Schema({
	image:{
		name: {
			type: String,
		},
		path: {
			type: String,
		},
		original_name:  {
			type: String,
		}
	},
	name: {
		type: String
	},
	description: {
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


module.exports = mongoose.model('Testimonial', TestimonialSchema);