'use strict';

const mongoose 	= require('mongoose'),
path 			= require('path'),
crypto 			= require('crypto'),
config 			= require(require(path.resolve('./config/env')).getEnv),
uniqueValidator = require('mongoose-unique-validator'),
Schema 			= mongoose.Schema,

SchoolSchema 	= new Schema({
	
	user_id: { 
       type: mongoose.Schema.Types.ObjectId
	},
	contact_name: {
		type: String,
		required:"Contact name is required",
		maxlength: [200, 'Contact Name cannot be more than {MAXLENGTH} characters.']
	},
    contact_title: {
		type: String,
		required:"Contact title is required",
		maxlength: [200, 'Contact Title cannot be more than {MAXLENGTH} characters.']
	},
	school_address: {
		type: String,
		maxlength: [200, 'School Address cannot be more than {MAXLENGTH} characters.']
	},
	school_type: {
		name:{
          type: String,
          default:"Other" 
		},
		abbreviation:{
		    type:String,
		    default:'O'	
		}
	},
	school_level: {
		type: Object
	},
	no_of_students_laptop: {
		type: Number,
		default:0
	},
	become_pilot_description: {
		type: String,
		maxlength: [200, 'Become Pilot Description cannot be more than {MAXLENGTH} characters.']
	},
	school_challenges_lesson_planning:{
		type:String,
		maxlength: [400, 'Challenges lesson planning cannot be more than {MAXLENGTH} characters.']
	},
	school_challenges_teacher_gradebook:{
		type:String,
		maxlength: [400, 'Challenges teacher gradebook cannot be more than {MAXLENGTH} characters.']
	},
	school_challenges_students_classwork:{
		type:String,
		maxlength: [400, 'Challenges student classwork cannot be more than {MAXLENGTH} characters.']
	},
	school_goals_lesson_planning:{
		type:String,
		maxlength: [400, 'Goals lesson planning cannot be more than {MAXLENGTH} characters.']
	},
	school_goals_teacher_gradebook:{
		type:String,
		maxlength: [400, 'Goals teacher gradebook cannot be more than {MAXLENGTH} characters.']
	},
	school_goals_students_classwork:{
		type:String,
		maxlength: [400, 'Goals student classwork  cannot be more than {MAXLENGTH} characters.']
	},
	pilot_request: {
		type: String,
		default: "Pending"
	},
	no_of_students: {
		type: Number,
		default:0,
		min:0,
		max: [9999, 'No of students cannot be more than {MAX} characters.'],
	},
    address:{
		type:Object
	},
	location:{
		type:Object
	},
	school_logo:{
		name: {
			type: String,
			default: ""
		},
		path: {
			type: String,
			default: config.default_school_logo.path
		},
		original_name:{
			type:String,
			default:config.default_school_logo.original_name
		}
	},
	school_code:{
		type:String
	},
	school_name: {
		type: String,
		maxlength: [200, 'School Name cannot be more than {MAXLENGTH} characters.']
	},
	school_telephoneno: {
		type: String,
		maxlength: [20, 'School Telephone No cannot be more than {MAXLENGTH} characters.']
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

module.exports = mongoose.model('School', SchoolSchema);