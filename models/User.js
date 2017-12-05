'use strict';

const mongoose 	= require('mongoose'),
path 			= require('path'),
crypto 			= require('crypto'),
config 			= require(require(path.resolve('./config/env')).getEnv),
uniqueValidator = require('mongoose-unique-validator'),
Schema 			= mongoose.Schema,

UserSchema 	= new Schema({
	uan:{
		type:String
	},
	seq_no:{
        type:Number
	},
	first_name:{
		type:String
	},
	last_name:{
		type:String
	},
	gender:{
		type:String
	},
	email_address: {
		type: String,
		lowercase: true,
    	trim: true,
		unique: 'The Email address you have entered already exists.',
		uniqueCaseInsensitive:true,
		required: 'E-mail is required',
		validate: {
			validator: function(email) {
				return /^([\w-\.+]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
			},
			message: '{VALUE} is not a valid email address'
		}
	},
	contact_telephoneno: {
		type: String,
		required:"Contact telephone is required",
		maxlength: [20, 'Contact Telephone No cannot be more than {MAXLENGTH} characters.']
	},	
	role: {
		type: String,
		enum: {
			values: ['superadmin', 'schooladmin', 'teacher','student'],
			message: '{VALUE} is not a valid role for user'
		},
		default: 'schooladmin'
	},
	email_verified: {
		type: Boolean,
		default: false
	},
	password: {
		type: String
	},
	status: {
		type: Boolean,
		default: false 
	},
	profile_image:{
		name: {
			type: String,
			default: config.image_name
		},
		path: {
			type: String,
			default: config.image_path
		},
		original_name: {
			type: String,
			default: config.image_name
		}
	},
	reset_password: {
		type: Object
	},
	school_id: { 
       type: mongoose.Schema.Types.ObjectId
	},
	salt: { 
		type: String
    },
	lastLoggedIn: { 
		type: Date 
	},
	ip: { 
		type: String 
	},
	pilot_request:{
		type:String,
		default:"Pending"
	},
	reject_reason:{
		type:String
	}
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

/* Mongoose beforeSave Hook : To hash a password */
UserSchema.pre('save', function(next) {
    let user = this;
    if (this.isModified('password') || this.isNew) {
        user.salt = crypto.randomBytes(16).toString('hex');
        user.password = this.hashPassword(config.salt, user.password);
        next();
    } else {
        return next();
    }
});


/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(salt, password) {
    if (salt && password) {
        return crypto.createHmac('sha512', salt).update(password).digest('base64');
    } else {
        return password;
    }
};


/* To check a password */
UserSchema.methods.comparePassword = function(salt, password) {
    return this.password === this.hashPassword(salt, password);
};

UserSchema.set('autoIndex', config.db.autoIndex);
UserSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator'
});
module.exports = mongoose.model('User', UserSchema);