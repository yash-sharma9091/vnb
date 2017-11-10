'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,
path 			= require('path'),
config 			= require(require(path.resolve('./config/env')).getEnv),

clientListSchema   = new Schema({
	name: {
		type: String
	},
	user_id:{
		type: mongoose.Schema.Types.ObjectId
	},
	subscription_id:{
		type: mongoose.Schema.Types.ObjectId
	},
	website_id:{
		type: mongoose.Schema.Types.ObjectId
	},
	image_url:{
		type: String,
		default: `${config.server.host}/${config.image_path}`
    },
	location: {
		type: String
	},
	plan: {
		type: String
	},
	date: {
		type: String
	},
	action:{
		type:String,
		default: 'Recently signed up'
	},
	link: {
		type: String,
		default: config.server.host
	}
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

clientListSchema.statics.findRandomClientList = function (where,projection) {
	
	return new Promise((resolve, reject) => {
		if( !where._id || !where.subscription_id ) return reject('Id and subscription_id are required');
		
		this.aggregate([ 
			{ 
			  $match: { 'user_id':mongoose.Types.ObjectId(where._id),
						'subscription_id':mongoose.Types.ObjectId(where.subscription_id),
						'website_id':mongoose.Types.ObjectId(where.website_id)
					  }
			},
			{ 
			  $project:projection
			},
			{ 
			  $sample: { size: 1 } 
			} 
		
		], (err, user) => {
			if( err ) {
				reject(err);
			} else {
				resolve(user);
			}
		})
	});
};

module.exports = mongoose.model('clientlist', clientListSchema);
