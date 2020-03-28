const {addonBuilder} = require("stremio-addon-sdk");
const horribleSubs = require("./horriblesubs");
const {b64encode, b64decode} = require("./helpers");
const parseTorrent = require("parse-torrent");
const {version} = require("../package");

const manifest = {
    "id": "com.sleeyax.horrible-addon",
    "version": version,
    "catalogs": [{
        "id": "horrible:catalog",
        "type": "series",
        "name": "HorribleSubs",
        "genres": ["Latest", "Season", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        "extra": [{"name": "search", "isRequired": false}, {"name": "genre", "isRequired": false}, {
            "name": "skip", "isRequired": false
        }],
    }],
    "resources": ["catalog", "meta", "stream"],
    "types": ["series", "movie"],
    "name": "Anime from HorribleSubs",
    "logo": "https://i.imgur.com/hXzIUeN.jpg",
    "background": "https://i.imgur.com/VBE8bCb.png",
    "description": "Anime torrents from HorribleSubs",
    "idPrefixes": ["horrible"]
};
const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async args => {
    let animes = [];
    let cache = 24 * 3600;
    if (args.extra.genre) {
        switch(args.extra.genre) {
            case "Season":
                animes = await horribleSubs.getSeasonAnime();
                break;
            case "Latest":
                animes = await horribleSubs.getLatestAnime();
                cache = 3600;
                break;
            default:
                animes = await horribleSubs.getAnimes(args.extra.genre.toLowerCase(), args.extra.skip || 0, 25);
                break;
        }
    } else if (args.extra.search) {
        animes = await horribleSubs.searchAnimes(args.extra.search);
    }

    animes = animes.map(async anime => {
        const info = await horribleSubs.getAnimeInfo(anime.url);
        return {
            id: "horrible:" + b64encode(anime.url),
            type: "series",
            name: anime.title,
            poster: info.picture,
            description: info.description
        };
    });

    return {metas: await Promise.all(animes), cacheMaxAge: cache};
});

builder.defineMetaHandler(async args => {
    const url = b64decode(args.id.split(":")[1]);
    const animeInfo = await horribleSubs.getAnimeInfo(url);
    const episodes = await horribleSubs.getAnimeEpisodes(animeInfo.id);

    return Promise.resolve({
        meta: {
            id: "horrible:" + b64encode(url),
            type: "series",
            name: animeInfo.title,
            runtime: `${animeInfo.title} | ${episodes.length} episodes`,
            genres: ["Anime"],
            poster: animeInfo.picture,
            background: "https://i.imgur.com/zepn5fy.png",
            logo: animeInfo.picture,
            description: animeInfo.description,
            videos: episodes.reverse().map((episode) => {
                return {
                    id: `horrible:${animeInfo.id}:1:${parseInt(episode.number)}`,
                    title: `${animeInfo.title} episode ${episode.number}`,
                    episode: parseInt(episode.number),
                    season: 1,
                    released: horribleSubs.formatDate(episode.releaseDate)
                }
            }),
        },
        cacheMaxAge: 24 * 3600
    });
});

builder.defineStreamHandler(async args => {
    const animeId = args.id.split(":")[1];
    const episodeNr = args.id.split(":")[3];
    const selectedEpisode = (await horribleSubs.getAnimeEpisodes(animeId)).find(episode => parseInt(episode.number) == episodeNr);

    return Promise.resolve({
        streams: selectedEpisode.resolutions.map(resolution => {
            return {
                title: resolution.name, infoHash: parseTorrent(resolution.magnet).infoHash
            };
        }),
        cacheMaxAge: 5 * (24 * 3600)
    });
});

module.exports =  builder.getInterface();
