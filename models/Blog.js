'use strict';

const mongoose 	= require('mongoose'),
path 			= require('path'),
config 			= require(require(path.resolve('./config/env')).getEnv),
uniqueValidator = require('mongoose-unique-validator'),
Schema 			= mongoose.Schema,

BlogSchema 	= new Schema({
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
	title: {
		type: String
	},
	type: {
		type: String
	},
	description: {
		type: String
	},
	short_description: {
		type: String
	},
	slug: {
		type: String,
		lowercase: true,
    	trim: true,
    	unque: true
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

/* Mongoose beforeSave Hook : To hash a password */
BlogSchema.pre('save', function(next) {
    let blog = this;
    
    if (this.isModified('title') || this.isNew) {
        blog.slug = this.constructor.generateSlug(blog);
        next();
    } else {
        return next();
    }
});

BlogSchema.statics.generateSlug = function (blog) {
	//https://gist.github.com/bentruyman/1211400
	return blog.title.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

BlogSchema.set('autoIndex', config.db.autoIndex);
BlogSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator'
});
module.exports = mongoose.model('Blog', BlogSchema);