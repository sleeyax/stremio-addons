#!/usr/bin/env node
const { publishToCentral } = require("stremio-addon-sdk");
const needle = require('needle');

if (process.argv.length == 3) {
    const url = process.argv[2];
    needle('get', url)
        .then(response => response.body)
        .then(body => {
            // IPFS supernode root url
            if (body.length > 0 && body.some(item => !!item.transportUrl)) {
                body.forEach(item => {
                    if (item.isConnected)
                        publish(`${url}${item.transportUrl}`);
                    else
                        console.log(`Warning: ${item.transportUrl} is not connected`);
                });
            }
            // http url to manifest.json
            else {
                publish(url);
            }
        }).catch(err => console.error(err));
} else {
    console.error("Please specify a string with the url to your manifest.json file");
}

function publish(url) {
    console.log('publishing ' + url);
    publishToCentral(url)
        .then(response => console.log(response))
        .catch(err => console.error(err));

}