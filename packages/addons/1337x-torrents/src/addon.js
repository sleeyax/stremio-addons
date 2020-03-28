const {addonBuilder} = require('stremio-addon-sdk');
const l33t = require('xtorrent');
const parseTorrent = require('parse-torrent');
const Video = require('stremio-cinemeta-proxy');
const allSettled = require('promise.allsettled');
allSettled.shim();
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
    // get info about the movie or series
    const video = new Video(args.id);
    const videoInfo = await video.getInfo();

    // build all possible search queries
    // for series, we dont only rely only on the 'SxxExx' format anymore but also search by episode name
    const searchQueries = [
        video.isSeries() ? videoInfo.name + ` S${padZero(videoInfo.episode.season)}E${padZero(videoInfo.episode.number)}` : videoInfo.name
    ];
    if (video.isSeries())
        searchQueries.push(`${videoInfo.name} ${videoInfo.episode.name}`);

    // query 1337x api & get results
    const searchResults = (await Promise.allSettled(searchQueries.map(query => l33t.search({query}))))
        .filter(promise => promise.status === 'fulfilled')
        .map(promise => promise.value)
        .flat()
        .filter(r => r.seed >= minSeeds);

    let infoResults = await toInfoList(searchResults);

    // filter results based on media type (note that series are sometimes listed as movie)
    infoResults = infoResults.filter(res => res.category === 'Movies' || res.category === 'TV');

    // transform results to Stremio stream obj array
    const streams = toStreams(infoResults);

    return Promise.resolve({
        streams,
        cacheMaxAge: nrOfDays(streams.length > 0 ? 7 : 1),
        staleRevalidate: nrOfDays(2),
        staleError: nrOfDays(7)
    });
});

module.exports = addon.getInterface();
