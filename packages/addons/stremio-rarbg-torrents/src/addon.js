require('dotenv').config({path: '.env'});
const manifest = require('./manifest');
const {addonBuilder} = require('stremio-addon-sdk');
const TorrentApi = require('./torrentapi');
const categories = require('./categories');
const {toStream, toZeroPaddedNumber} = require('./utils');
const redis = require('./redis');
const addon = new addonBuilder(manifest);

addon.defineStreamHandler(async args => {
    // console.log('[INFO] Streams: ', args);

    // get app id and token from redis store
    let redisValue = await redis.getValue();
    if (redisValue == null)
        redisValue = await redis.generateValue();

    console.log('[INFO] Current Appid & Token: ' + redisValue);

    const splitted = redisValue.split(':');
    const torrentApi = new TorrentApi(splitted[0], splitted[1]);

    let streams = [];
    let torrentResults;
    try {
        if (args.type === 'movie') {
            torrentResults = await torrentApi.searchImdb(args.id, Object.values(categories.movies));
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
                    category: Object.values(categories.tv) // '18;41;49'
                });
        }
    }catch(ex) {
        // get a new app id & token when the api makes them unusable for no reason whatsoever
        if (ex.name == 'StatusCodeError') {
            console.log(`[ERROR] ${redisValue} became invalid, generating new app id & token...`);
            redisValue = redis.generateValue();
        }else {console.error(ex)}
    }

    if (torrentResults != null && torrentResults.length != 0 && !torrentResults.error)
        streams = toStream(torrentResults);

    return Promise.resolve({streams, cacheMaxAge: 3 * (24 * 3600)});
});

module.exports = addon.getInterface();
