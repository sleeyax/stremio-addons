require('dotenv').config({path: '.env'});
const manifest = require('./manifest');
const {addonBuilder} = require('stremio-addon-sdk');
const TorrentApi = require('./torrentapi');
const torrentApi = new TorrentApi();
const {toStream} = require('./utils');

const addon = new addonBuilder(manifest);

addon.defineStreamHandler(async args => {
    console.log('Streams: ', args);

    let streams = [];
    let torrentResults = args.type === 'movie' ?  await torrentApi.searchImdb(args.id) : await torrentApi.searchText(args.id);

    if (torrentResults != null && !torrentResults.error)
        streams = toStream(torrentResults);

    return Promise.resolve({streams});
});

module.exports = addon.getInterface();
