'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,

teacherSchema   = new Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId
	},
	school_id: {
		type: mongoose.Schema.Types.ObjectId
	},
	teacher_code: {
		type: String
	},
	joining_date: {
		type: Date,
		default: Date.now
	},
	department_name: {
		type: String
	},
	designation: {
		type: String
	},
	qualification: {
		type: String
	},
	experience: {
		type: String
	},
	grade: {
		type: Array
	},
	subject: {
		type: Array
	}
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('teacher', teacherSchema);