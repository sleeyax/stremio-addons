const {addonBuilder} = require('stremio-addon-sdk');
const l33t = require('xtorrent');
const imdbIdToTitle = require('imdbid-to-title');
const parseTorrent = require('parse-torrent');
const manifest = require('./manifest');

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

const nrOfDays = (nr) => nr * (24 * 3600);

addon.defineStreamHandler(async args => {
    const movieTitle = await imdbIdToTitle(args.id);
    // query 1337x api & get results
    let results = await toInfoList(await l33t.search({query: movieTitle}));

    // filter results based on media type
    results = results.filter(res => res.category === (args.type === 'movie' ? 'Movies' : 'Series'));

    // transform results to Stremio stream obj array
    const streams = toStreams(results);

    return Promise.resolve({
        streams,
        cacheMaxAge: nrOfDays(2),
        staleRevalidate: nrOfDays(1),
        staleError: nrOfDays(5)
    });
});

module.exports = addon.getInterface();
