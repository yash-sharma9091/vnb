'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,

contactUsSchema   = new Schema({
	question: {
		type: String,
		required:"Contact question is required",
		maxlength: [200, 'Contact question cannot be more than {MAXLENGTH} characters.']
	},
	name: {
		type: String,
		maxlength: [200, 'Contact Name cannot be more than {MAXLENGTH} characters.']
	},
	email: {
		type: String,
		lowercase: true,
    	trim: true,
		uniqueCaseInsensitive:true,
		required: 'E-mail is required',
		validate: {
			validator: function(email) {
				return /^([\w-\.+]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
			},
			message: '{VALUE} is not a valid email address'
		}
	},
	phone: {
		type: String,
		required:"Contact phone is required",
		maxlength: [20, 'Contact phone No cannot be more than {MAXLENGTH} characters.']
	}
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('contactus', contactUsSchema);