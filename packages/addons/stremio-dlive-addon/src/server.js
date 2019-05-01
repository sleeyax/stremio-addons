#!/usr/bin/env node

const { serveHTTP } = require("stremio-addon-sdk");
const addonReady = require("./addon");

addonReady.then(addonInterface => {
    serveHTTP(addonInterface, { port: 49305 });
});

