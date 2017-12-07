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


module.exports = mongoose.model('teacher', teacherSchema);