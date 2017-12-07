'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,

studentSchema   = new Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId
	},
	school_id: {
		type: mongoose.Schema.Types.ObjectId
	},
	dob: {
		type: String
	},
	grade: {
		type: String
	},
	student_code: {
		type: String
	},
	official_grade: {
		type: String
	},
	admission_date:{
        type:Date,
        default:Date.now
	},
	parent_name: {
		type: String
	},
	parent_relation: {
		type: String
	},
	address: {
		type: String,
		maxlength: [200, 'Address cannot be more than {MAXLENGTH} characters.']
	},
	country: {
		type: String,
		maxlength: [200, 'Country cannot be more than {MAXLENGTH} characters.']
	},
	state: {
		type: String,
		maxlength: [200, 'State cannot be more than {MAXLENGTH} characters.']
	},
	city: {
		type: String,
		maxlength: [200, 'City cannot be more than {MAXLENGTH} characters.']
	},
	postal_code: {
		type: String,
		maxlength: [200, 'Postal Code cannot be more than {MAXLENGTH} characters.']
	},
	location:{
		type:Object
	}
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('student', studentSchema);