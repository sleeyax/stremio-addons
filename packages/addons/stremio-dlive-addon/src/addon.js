const {addonBuilder} = require("stremio-addon-sdk");
const Dlive = require("./dlive");

const dlive = new Dlive();

module.exports = dlive.getCategories().then(categories => {
    const manifest = {
        "id": "com.sleeyax.dliveaddon",
        "name": "Dlive.tv",
        "version": "0.0.1",
        "description": "View live streams from dlive.tv",
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

    builder.defineCatalogHandler((args) => {
        console.log(args);

        let results;

        switch (args.type) {
            case "tv":
                const selectedCatagory = categories.find(item => item.title === args.extra.genre) || {backendID: 0};
                const categoryId = selectedCatagory.backendID;
                results = dlive.getLiveStreams(categoryId, args.extra.skip || -1, 50).then(streams => {
                    return streams.list.map(stream => {
                        return {
                            id: stream.id,
                            type: "tv",
                            genres: [streams.category],
                            name: stream.title,
                            poster: stream.thumbnailUrl,
                            posterShape: "landscape"
                        };
                    });
                });
                break;
            default:
                results = Promise.resolve([]);
                break;
        }

        return results.then(items => {
            return {metas: items};
        });
    });

    builder.defineStreamHandler(args => {
        console.log(args);

        let results;

        switch (args) {
            case "tv":
                // TODO
                break;
            default:
                results = Promise.resolve();
                break;
        }

        return Promise.resolve({streams: []});
    });

    builder.defineMetaHandler(args => {
        console.log(args);
        return Promise.resolve({meta: {}});
    });

    return builder.getInterface();
});

