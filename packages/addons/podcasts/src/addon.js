require('dotenv').config();
const {addonBuilder} = require("stremio-addon-sdk");
const {version} = require("../package");

const GpodderAdapter = require("./adapters/gpodder-adapter");
const gpodderAdapter = new GpodderAdapter();
const SpreakerAdapter = require("./adapters/spreaker-adapter");
const spreakerAdapter = new SpreakerAdapter();

module.exports = async () => {
    const manifest = {
        "id": "com.sleeyax.podcasts-addon",
        "version": version,
        "catalogs": [
            {
                "id": "podcasts_gpodder_catalog",
                "type": "Podcasts",
                "name": "Gpodder",
                "genres": await gpodderAdapter.getGenres(),
                "extra": [{"name": "search", "isRequired": false}, {"name": "genre", "isRequired": false}, {"name": "skip", "isRequired": false}],
            },
            {
                "id": "podcasts_spreaker_catalog",
                "type": "Podcasts",
                "name": "Spreaker",
                "genres": await spreakerAdapter.getGenres(),
                "extra": [{"name": "search", "isRequired": false}, {"name": "genre", "isRequired": false}, {"name": "skip", "isRequired": false}],
            }
        ],
        "resources": ["catalog", "meta", "stream"],
        "types": ["series", "channel", "Podcasts"],
        "name": "Podcasts",
        "logo": "https://i.imgur.com/d3ZykZR.png",
        "background": "https://i.imgur.com/mUFi0SR.jpg",
        "description": "#1 podcasts addon offering ‭almost unlimited high quality podcasts from multiple sources!",
        "idPrefixes": ["podcasts_"]
    };
    const builder = new addonBuilder(manifest);

    builder.defineCatalogHandler(async args => {
        let metas = [];

        switch(args.id.split("_")[1]) {
            case "gpodder":
                metas = await gpodderAdapter.getSummarizedMetaDataCollection(args);
                break;
            case "spreaker":
                metas = await spreakerAdapter.getSummarizedMetaDataCollection(args);
                break;
            default:
                break;
        }
        return {metas: metas, cacheMaxAge: 24 * 3600};
    });

    builder.defineMetaHandler(async args => {
        switch(args.id.split("_")[1]) {
            case "gpodder":
                return gpodderAdapter.getMetaData(args);
            case "spreaker":
                return spreakerAdapter.getMetaData(args);
            default:
                return Promise.resolve({meta: null});
        }
    });

    builder.defineStreamHandler(async args => {
        switch(args.id.split("_")[1]) {
            case "gpodder":
                return await gpodderAdapter.getStreams(args);
            case "spreaker":
                return await spreakerAdapter.getStreams(args);
            default:
                return Promise.resolve({streams: null});
        }
    });

    return builder.getInterface();
};
