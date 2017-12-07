'use strict';

const GEO  = require('node-geocoder'),
      PATH = require('path'),
      env  = require(PATH.resolve(`./config/env/${process.env.NODE_ENV}`));

    

class GEOCODER {

  /*setting GLOBAL paramters for this GEO class*/
    constructor(){
      let geoOptions = {
          provider: 'google',
          httpAdapter: 'https', // Default 
          apiKey: process.env.MAPKEY, // for Mapquest, OpenCage, Google Premier 
          formatter: null         // 'gpx', 'string', ... 
      };
      this.geoOptions = geoOptions;
    }

    initGEOCODER(){
      /*initialize GEOCODER module to get address data*/
      return GEO(this.geoOptions);
    }

    LATLON(address, callback) {
      /*init GEOCODER*/
      let instance = this.initGEOCODER();
      instance.geocode(address, (err, latlon) => {
        if(latlon) callback(latlon); else callback("No data found or invalid address");
      });
    }
}

module.exports = GEOCODER;