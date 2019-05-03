const {addonBuilder} = require("stremio-addon-sdk");
const Dlive = require("./dlive");

const dlive = new Dlive();

// TODO: fetch stream background, avatar & description from operationName=LivestreamPage

module.exports = dlive.getCategories().then(categories => {
    const manifest = {
        "id": "com.sleeyax.dlive-addon",
        "name": "Dlive.tv",
        "version": "0.0.1",
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
        "types": ["tv"]
    };

    const builder = new addonBuilder(manifest);

    builder.defineCatalogHandler(async (args) => {

        if (args.type !== "tv") {
            return {metas: []};
        }

        const selectedCatagory = categories.find(item => item.title === args.extra.genre) || {backendID: 0};
        const categoryId = selectedCatagory.backendID;
        const streams = await dlive.getLiveStreams(categoryId, args.extra.skip || -1, 50);
        const metas = streams.list.map(stream => {
            return {
                id: "dlive_user:" + stream.creator.username,
                type: "tv",
                genres: [streams.category],
                name: stream.title,
                poster: stream.thumbnailUrl,
                posterShape: "landscape"
            };
        });

        return {metas};
    });

    builder.defineStreamHandler(async (args) => {
        console.log(args);

        if (args.type !== "tv") {
            return {streams: []};
        }

        const streamSources = await dlive.getStreamSources(args.id);
        const streams = streamSources.map(stream => {
            return {
                url: stream.url,
                title: stream.RESOLUTION + " " + stream.VIDEO
            };
        });

        return {streams};
    });

    builder.defineMetaHandler(args => {
        console.log(args);
        return Promise.resolve({meta: {}});
    });

    return builder.getInterface();
});

