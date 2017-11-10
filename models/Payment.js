'use strict';

const mongoose 	= require('mongoose'),
path 			= require('path'),
crypto 			= require('crypto'),
config 			= require(require(path.resolve('./config/env')).getEnv),
uniqueValidator = require('mongoose-unique-validator'),
Schema 			= mongoose.Schema,

PaymentSchema   = new Schema({
    payment_id: {
        type: String,
    },
    amount: {
        type: Number,
    },
    balance_transaction: {
        type: String
    },
    customer: {
    	type: String
    },
    description: {
    	type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    plan_id: {
    	type: mongoose.Schema.Types.ObjectId
    },
    plan_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: Boolean,
        default: false
    },
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('Payment', PaymentSchema);