const {serveHTTP} = require("stremio-addon-sdk");
const addonInterface = require("./addon");

serveHTTP(addonInterface, {port: process.env.PORT || process.argv[2] || 58362});
