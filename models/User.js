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
    contact_title: {
		type: String,
		maxlength: [50, 'Contact Title cannot be more than {MAXLENGTH} characters.']
	},
	contact_name: {
		type: String,
		maxlength: [200, 'Contact Name cannot be more than {MAXLENGTH} characters.']
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
		maxlength: [20, 'Contact Telephone No cannot be more than {MAXLENGTH} characters.']
	},
	school_telephoneno: {
		type: String,
		maxlength: [20, 'School Telephone No cannot be more than {MAXLENGTH} characters.']
	},
	school_name: {
		type: String,
		maxlength: [100, 'School Name cannot be more than {MAXLENGTH} characters.']
	},
	school_address: {
		type: String,
		maxlength: [200, 'School Address cannot be more than {MAXLENGTH} characters.']
	},
	no_of_students: {
		type: Number,
		default:0,
		max: [4, 'No of students cannot be more than {MAX} characters.'],
	},
	school_type: {
		type: String,
		maxlength: [100, 'School Type cannot be more than {MAXLENGTH} characters.'],
		default:"Other"
	},
	school_level: {
		type: String,
		maxlength: [100, 'School Level cannot be more than {MAXLENGTH} characters.']
	},
	become_pilot_description: {
		type: String,
		maxlength: [160, 'Become Pilot Description cannot be more than {MAXLENGTH} characters.']
	},
	no_of_students_laptop: {
		type: Number,
		default:0
	},
	school_challenges_lesson_planning:{
		type:String
	},
	school_challenges_teacher_gradebook:{
		type:String
	},
	school_challenges_students_classwork:{
		type:String
	},
	school_goals_lesson_planning:{
		type:String
	},
	school_goals_teacher_gradebook:{
		type:String
	},
	school_goals_students_classwork:{
		type:String
	},
	role: {
		type: String,
		enum: {
			values: ['superadmin', 'schooladmin', 'user'],
			message: '{VALUE} is not a valid role for user'
		},
		default: 'schooladmin'
	},
	email_verified: {
		type: Boolean,
		default: false
	},
	password: {
		type: String,
		required: 'Password is required',
		minlength: [6, 'Password must be atleast 6 characters long.']
	},
	status: {
		type: Boolean,
		default: false 
	},
	pilot_request: {
		type: String,
		default: "Pending"
	},
	reset_password: {type: Object},
	salt: { type: String },
	lastLoggedIn: { type: Date },
	ip: { type: String }
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