const {addonBuilder} = require("stremio-addon-sdk");
const Dlive = require("./dlive");

const dlive = new Dlive();

async function init() {
    const categories = await dlive.getCategories();
    const manifest = {
        "id": "com.sleeyax.dlive-addon",
        "name": "Dlive.tv",
        "version": "0.0.3",
        "description": "View livestreams from dlive.tv",
        "catalogs": [{
            "id": "dlive_catalog", "type": "tv", "name": "Dlive.tv", "genres": categories.map(item => item["title"]), "extra": [{
                "name": "search", "isRequired": false
            }, {
                "name": "genre", "isRequired": false
            }, {
                "name": "skip", "isRequired": false
            }]
        }],
        "resources": ["stream", "meta", "catalog"],
        "types": ["tv"],
        "logo": "https://i.imgur.com/ATBbkfz.png",
        "idPrefixes": ["dlive_"]
    };

    const builder = new addonBuilder(manifest);

    builder.defineCatalogHandler(async (args) => {
        let streams = [];
        if (args.extra.search) {
            streams = await dlive.searchLiveStreams(args.extra.search);
        }else{
            const selectedCatagory = categories.find(item => item.title === args.extra.genre) || {backendID: 0};
            const categoryId = selectedCatagory.backendID;
            streams = await dlive.getLiveStreams(categoryId, args.extra.skip || -1, 50);
        }

        streams = streams.map(stream => {
            return {
                id: "dlive_user:" + stream.creator.username + "|" + stream.creator.displayname,
                type: "tv",
                genres: [stream.category.title],
                name: stream.title,
                poster: stream.thumbnailUrl,
                posterShape: "landscape",
                logo: stream.creator.avatar,
                banner: stream.thumbnailUrl
            };
        });

        return Promise.resolve({metas: streams, cacheMaxAge:  7 * 60}); // cache for 7 minutes (streamers can go online any second, we don't want this value to be too high)
    });

    builder.defineStreamHandler(async (args) => {
        const streamSources = await dlive.getStreamSources(args.id);
        const streams = streamSources.map(stream => {
            return {
                url: stream.url,
                title: stream.RESOLUTION + " " + stream.VIDEO
            };
        });

        return Promise.resolve({streams});
    });

    builder.defineMetaHandler(async args => {
        const displayname = args.id.split(":")[1].split("|")[1];
        const userStreamInfo = await dlive.getUserInfo(displayname);

        return Promise.resolve({
            meta: {
                id: args.id,
                type: "tv",
                name: userStreamInfo.livestream.title,
                genres: [userStreamInfo.livestream.category.title],
                poster: userStreamInfo.livestream.thumbnailUrl,
                posterShape: "landscape",
                background: userStreamInfo.livestream.thumbnailUrl,
                logo: userStreamInfo.avatar,
                description: userStreamInfo.about,
                director: [displayname],
                language: userStreamInfo.livestream.language.language,
            },
            cacheMaxAge: 4 * 3600 // cache for 4 hours
        });
    });

    return builder.getInterface();
}

module.exports = init;
