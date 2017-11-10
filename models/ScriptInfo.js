'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,

scriptInfoSchema   = new Schema({
	hostname: {
		type: String
	},
	origin: {
		type: String
	},
	platform: {
		type: String
	},
	userAgent: {
		type: String
	}
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});



scriptInfoSchema.statics.saveScriptInfo = function (data) {
	return new Promise((resolve, reject) => {
		if(!data){
		   reject();
		}
		else{
		  	this.findOne({hostname:data.hostname},(err, user) => {
				if( err ) {
					reject(err);
				} else {
					if(!user){
				     var scriptinfo = new this(data);	
			          scriptinfo.save((err,result) => {
			       	  	 if( err ) {
							reject(err);
						 } else {
							resolve(result);
						 }
			          }); 	
					}
					else{
					  reject();	
					}
				 
				}
		    });
  		}
	});
};

module.exports = mongoose.model('scriptinfo', scriptInfoSchema);