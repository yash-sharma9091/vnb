'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,

SubscriptionSchema   = new Schema({
		name: {
			type: String
		},
		description: {
			type: String
		},
		price: {
			type: Number
		},
		order: {
			type: String
		},
		features: {
			type: Array
		},
        type: {
			type: String
		},
		expiration_date: {
			type: Date
		},
		status: {
			type: Boolean,
			default: false
		},
		domain_allowed: {
			type: Number
		},
		image:{
			name: {
				type: String,
			},
			path: {
				type: String,
			},
			original_name:  {
				type: String,
			}
	   }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('Subscription', SubscriptionSchema);
