require('dotenv').config({path: '.env'});
const manifest = require('./manifest');
const {addonBuilder} = require('stremio-addon-sdk');
const TorrentApi = require('./torrentapi');
const torrentApi = new TorrentApi();
const {toStream, toZeroPaddedNumber} = require('./utils');

const addon = new addonBuilder(manifest);

addon.defineStreamHandler(async args => {
    console.log('Streams: ', args);

    let streams = [];
    let torrentResults;
    if (args.type === 'movie') {
        torrentResults =  await torrentApi.searchImdb(args.id);
    } else if (args.type === 'series') {
        const splitted = args.id.split(':');
        const series = {
            imdb: splitted[0],
            season: splitted[1],
            episode: splitted[2]
        };
        torrentResults = await torrentApi.queryAPI(
            'search',
            {
                search_imdb: series.imdb,
                // format: S05E21
                search_string: `S${toZeroPaddedNumber(series.season)}E${toZeroPaddedNumber(series.episode)}`,
                category: '18;41;49'
            });
    }

    if (torrentResults != null && torrentResults.length != 0 && !torrentResults.error)
        streams = toStream(torrentResults);

    return Promise.resolve({streams});
});

module.exports = addon.getInterface();
