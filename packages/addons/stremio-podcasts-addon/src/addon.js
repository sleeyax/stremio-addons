const {addonBuilder} = require("stremio-addon-sdk");
const Gpodder = require("./providers/gpodder");
const feedParser = require("podcast-feed-parser");
const {b64decode, b64encode, toHumanReadableFileSize} = require("./helpers");
const gpodder = new Gpodder();

module.exports = async () => {
    const manifest = {
        "id": "com.sleeyax.podcasts-addon",
        "version": "0.0.1",
        "catalogs": [{
            "id": "podcasts_catalog",
            "type": "channel",
            "name": "Podcasts",
            "genres": (await gpodder.getAllCategories()).map(category => category.title),
            "extra": [{"name": "search", "isRequired": false}, {"name": "genre", "isRequired": false}, {
                "name": "skip",
                "isRequired": false
            }],
        }],
        "resources": ["catalog", "meta", "stream"],
        "types": ["channel"],
        "name": "Podcasts",
        "logo": "https://i.imgur.com/d3ZykZR.png",
        "description": "Listen to podcasts from gpodder.net",
        "idPrefixes": ["podcasts_"]
    };
    const builder = new addonBuilder(manifest);

    builder.defineCatalogHandler(async args => {
        console.log("catalogs: ", args);

        const count = args.extra.skip || 50;
        let podcasts = args.extra.search ? await gpodder.searchPodCasts(args.extra.search) :
                       args.extra.genre != null ? await gpodder.getPodCasts(args.extra.genre, count) : await gpodder.getTopPodcasts(count);

        let metas = podcasts.map(podcast => {
            return {
                id: "podcasts_" + b64encode(podcast.url),
                type: "channel",
                genres: args.extra.genre || "Top",
                name: podcast.title,
                poster: podcast.logo_url,
                posterShape: "square",
                background: podcast.logo_url,
                logo: podcast.logo_url,
                description: podcast.description
            }
        });

        return {metas};
    });

    builder.defineMetaHandler(async args => {
        console.log("meta: ", args);

        const url = b64decode(args.id.split("_")[1]);
        const feed = await feedParser.getPodcastFromFeed(await gpodder.getPodcastFeed(url));

        return Promise.resolve({
            meta: {
                id: args.id,
                type: "channel",
                name: feed.meta.title,
                genre: feed.meta.categories,
                poster: feed.meta.imageURL,
                posterShape: "square",
                background: feed.meta.imageURL,
                logo: feed.meta.imageURL,
                description: feed.meta.description,
                videos: feed.episodes.map(episode => {
                    return {
                        id: "podcasts_episode_" + b64encode(JSON.stringify(episode.enclosure)),
                        title: episode.title,
                        released: new Date(episode.pubDate)
                    }
                }),
                director: [feed.meta.owner.name],
                language: feed.meta.language,
                website: feed.meta.link
            }
        });
    });

    builder.defineStreamHandler(args => {
        console.log("streams: ", args);

        const episode = JSON.parse(b64decode(args.id.split("_")[2]));

        return Promise.resolve({
            streams: [
                {
                    url: episode.url,
                    title: `${episode.type} (${toHumanReadableFileSize(episode.length)})`
                }
            ]
        });
    });

    return builder.getInterface();
};
