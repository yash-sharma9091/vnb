'use strict';

const path = require('path');
exports.getEnv = path.resolve(`./config/env/${process.env.NODE_ENV}`);