const {addonBuilder} = require("stremio-addon-sdk");
const Dlive = require("./dlive");

const dlive = new Dlive();

module.exports = dlive.getCategories().then(categories => {
    const genres = categories.map(item => item["title"]);
    return {
        "id": "com.sleeyax.dliveaddon",
        "name": "Dlive.tv",
        "version": "0.0.1",
        "description": "View live streams from dlive.tv",
        "catalogs": [{
            "id": "dlive_catalog", "type": "tv", "name": "Dlive.tv", "genres": genres, "extra": [{
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
}).then(manifest => {
    const builder = new addonBuilder(manifest);

    builder.defineCatalogHandler(({type, id}) => {
        let results;

        switch (type) {
            case "tv":
                // TODO: show available streams
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
        return Promise.resolve({streams: []});
    });

    builder.defineMetaHandler(args => {
        console.log(args);
        return Promise.resolve({meta: {}});
    });

    return builder.getInterface();
});

