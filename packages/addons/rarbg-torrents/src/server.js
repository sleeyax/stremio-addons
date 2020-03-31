const {serveHTTP} = require('stremio-addon-sdk');
const addon = require('./addon');

serveHTTP(addon, {port: process.env.PORT || process.argv[2] || 39730});
