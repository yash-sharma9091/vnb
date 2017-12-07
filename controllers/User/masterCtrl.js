'use strict';
const path 	 	= require('path'),
	mongoose 	= require('mongoose'),
	Master      = require(path.resolve('./models/Master')),
    Class      = require(path.resolve('./models/Class')),
    Section      = require(path.resolve('./models/Section')),
    Subject      = require(path.resolve('./models/Subject')),
  	config 		= require(path.resolve(`./config/env/${process.env.NODE_ENV}`)),
  	response    = require(path.resolve('./config/lib/response'));


exports.getMasterData = (req, res, next) => {

    Master.find({}, 
    	function (error, result) {
    		if(error){
    			res.json(response.error(error));
    		}
    		res.json(response.success(result));
    	}
    );
};

exports.getClassData = (req, res, next) => {
    // if( !req.query._id){
    //     return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
    //             .json(response.required({message: 'Id is required'}));
    // }
    Class.find({}, 
        function (error, result) {
            if(error){
                res.json(response.error(error));
            }
            res.json(response.success(result));
        }
    );
};

exports.getSectionData = (req, res, next) => {
   if( !req.query._id){
        return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
                .json(response.required({message: 'Id is required'}));
    }
    Section.find({class_id:req.query._id}, 
        function (error, result) {
            if(error){
                res.json(response.error(error));
            }
            res.json(response.success(result));
        }
    );
};

exports.getSubjectData = (req, res, next) => {
    if( !req.query._id){
        return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
                .json(response.required({message: 'Id is required'}));
    }
    Subject.find({section_id:req.query._id}, 
        function (error, result) {
            if(error){
                res.json(response.error(error));
            }
            res.json(response.success(result));
        }
    );
};

