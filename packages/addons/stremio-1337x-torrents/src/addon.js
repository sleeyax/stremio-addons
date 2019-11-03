const {addonBuilder} = require('stremio-addon-sdk');
const l33t = require('xtorrent');
const imdbIdToTitle = require('imdbid-to-title');
const parseTorrent = require('parse-torrent');
const manifest = require('./manifest');
const {minSeeds} = require('../package');

const addon = new addonBuilder(manifest);

/**
 * Map search results to array of movies and series incl. information
 * @param {Array} searchResults
 * @return {Promise}
 */
function toInfoList(searchResults) {
    return Promise.all(searchResults.map(async result => await l33t.info(result.href)));
}

/**
 * Convert an array of movie & series from 1337x to an array of stream objects
 * @param infoList
 */
function toStreams(infoList) {
    return infoList.map(item => {
        return {
            name: '1337x',
            title: `${item.title.trim()} (${item.type})\n${item.language}\nS: ${item.seeders} L: ${item.leechers}\n${item.size}`,
            infoHash: parseTorrent(item.download.magnet).infoHash
        };
    });
}

function parseSerie(id) {
    const splitted = id.split(':');
    return {
        imdb: splitted[0],
        season: splitted[1],
        episode: splitted[2]
    };
}

const nrOfDays = (nr) => nr * (24 * 3600);
const padZero = (num) => num <= 9 ? '0' + num : num;

addon.defineStreamHandler(async args => {
    let query;
    if (args.type === 'series') {
        const serie = parseSerie(args.id);
        query = (await imdbIdToTitle(serie.imdb)).trim() + ` S${padZero(serie.season)}E${padZero(serie.episode)}`;
    }else {
        query = await imdbIdToTitle(args.id);
    }

    // query 1337x api & get results
    const searchResults = (await l33t.search({query})).filter(r => r.seed >= minSeeds);
    let infoResults = await toInfoList(searchResults);

    // filter results based on media type (note that series are sometimes listed as movie)
    infoResults = infoResults.filter(res => res.category === 'Movies' || res.category === 'TV');

    // transform results to Stremio stream obj array
    const streams = toStreams(infoResults);

    return Promise.resolve({
        streams,
        cacheMaxAge: nrOfDays(2),
        staleRevalidate: nrOfDays(1),
        staleError: nrOfDays(5)
    });
});

module.exports = addon.getInterface();
