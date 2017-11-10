'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,

contactUsSchema   = new Schema({
	email: {
		type: String
	},
	mobile: {
		type: String
	},
	subject: {
		type: String
	},
	message: {
		type: String
	}
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('contactus', contactUsSchema);