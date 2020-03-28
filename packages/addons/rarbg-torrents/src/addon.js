require('dotenv').config({path: '.env'});
const manifest = require('./manifest');
const {addonBuilder} = require('stremio-addon-sdk');
const TorrentApi = require('./torrentapi');
const categories = require('./categories');
const {toStream, toZeroPaddedNumber, delay, nrOfDays} = require('./utils');
const redis = require('./redis');
const addon = new addonBuilder(manifest);

addon.defineStreamHandler(async args => {
    // wait 2 seconds per requests for now
    // TODO: find out how to get last execution time on now, so we can wait using the actual interval instead of the full 2 seconds
    await delay(2000);

    // get app id and token from redis store
    let redisValue = await redis.getValue();
    if (redisValue == null)
        redisValue = await redis.generateValue();

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
                    category: Object.values(categories.tv).join(';') // '18;41;49'
                });
        }
    }catch(ex) {
        // get a new app id & token when the api makes them unusable for no reason whatsoever
        if (ex.name == 'StatusCodeError') {
            redisValue = redis.generateValue();
        }
    }

    if (torrentResults != null && torrentResults.length != 0 && !torrentResults.error)
        streams = toStream(torrentResults);

    return Promise.resolve({
        streams,
        cacheMaxAge: nrOfDays(streams.length > 0 ? 7 : 1),
        staleRevalidate: nrOfDays(2),
        staleError: nrOfDays(7)
    });
});

module.exports = addon.getInterface();
