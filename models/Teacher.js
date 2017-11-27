'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,

teacherSchema   = new Schema({
	uan: {
		type: String
	},
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	gender: {
		type: String
	},
	email_address: {
		type: String
	},
	telephone_no: {
		type: String
	},
	teacher_profile: {
		type: Object
	},
	assign_grade: {
		type: String
	},
	assign_code: {
		type: String
	},
	assign_subject: {
		type: Object
	}
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('teacher', teacherSchema);