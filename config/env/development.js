"use strict";
const config = {
	db: {
		URL: 'mongodb://localhost/virtualnotebook',
		DEBUG: true,
		autoIndex: true,
    options: {
      useMongoClient: true
    }
	},
	server: {
    host: 'http://localhost:3000',
		PORT: 7000
	},
  socket_server:{
    SOCKETPORT:5000
  },
	mail:{
		poolConfig : {
			pool: true,
		    host: 'smtp.gmail.com', // Gmail as mail client
		    port: 465,
		    secure: true, // use SSL
		    auth: {
		    	user: process.env.USERNAME,
		    	pass: process.env.PASSWORD
		    }
		},
		from: 'PencilsINK <noreply@pencilsink.com>',
    testing: 'flexsin.nodejs@gmail.com'
	},
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
        directoryPath: `${process.cwd()}/logs`,
        fileName: 'app.log',
        maxsize: 10485760,
        maxFiles: 2,
        json: true
    }
  },
	sendgrid: {
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
  },
 	mailTransporter: 'sendgrid',
 	salt: '51ca5acbce3e6a5b2dd9772b36cff34c',
 	secret: '876sdf&%&^435345(*^&^654sdsdc&^&kjsdfjbksdureyy3(&(*&(&7$%^#%#&^*(&)*)*',
 	allowed_image_extensions : ['image/jpeg','image/jpg','image/png','image/gif','image/bmp','text/csv'],
 	file_extensions : {
 		'image/jpeg' : 'jpg',
 		'image/jpg' : 'jpg',
 		'image/png' : 'png',
 		'image/gif' : 'gif',
 		'image/bmp' : 'bmp'
  },
  allowed_csv_extensions:['text/csv','application/csv','application/octet-stream','text/comma-separated-values'],
  csv_extensions:{
    'text/csv' : 'csv',
    'application/csv':'csv',
    'application/octet-stream':'csv',
    'text/comma-separated-values':'csv'
  },
  blog_image_destination: 'assets/blog',
 	image_path: 'assets/images/default-user.png',
 	image_name: 'default-user.png',
 	fileLimits: {
      fileSize: 10000000, //the max file size (in bytes)
      files: 10 //the max number of file
  },
  docLimit: 10,
  defaultAdmin: {
  	email_address: 'admin@gmail.com',
  	password: '123456',
  	role: 'admin',
  	status: true,
    email_verified: true
  },
  masterPassword: 'admin@virtualnotebook'
};
module.exports = config;