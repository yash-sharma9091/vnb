'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,

studentSchema   = new Schema({
	uan: {
		type: String
	},
	student_first_name: {
		type: String
	},
	student_last_name: {
		type: String
	},
	student_dob: {
		type: String
	},
	student_grade: {
		type: String
	},
	student_code: {
		type: String
	},
	student_gender: {
		type: String
	},
	student_email_address: {
		type: String
	},
	student_phone_no: {
		type: String
	},
	student_profile: {
		type: Object
	},
	parent_name: {
		type: String
	},
	parent_relation: {
		type: String
	},
	parent_address: {
		type: Object
	},
	parent_country: {
		type: String
	},
	parent_state: {
		type: String
	},
	parent_city: {
		type: Object
	},
	parent_phone_no: {
		type: String
	},
	parent_email_address: {
		type: Object
	}
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('student', studentSchema);