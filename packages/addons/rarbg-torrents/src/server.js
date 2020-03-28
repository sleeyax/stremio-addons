const {serveHTTP} = require('stremio-addon-sdk');
const addon = require('./addon');

serveHTTP(addon, {port: 39730});
