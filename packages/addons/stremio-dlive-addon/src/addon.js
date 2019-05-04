const {addonBuilder} = require("stremio-addon-sdk");
const Dlive = require("./dlive");

const dlive = new Dlive();

async function init() {
    const categories = await dlive.getCategories();
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
        "types": ["tv"],
        "logo": "https://i.imgur.com/ATBbkfz.png"
    };

    const builder = new addonBuilder(manifest);

    builder.defineCatalogHandler(async (args) => {
        console.log("catalog: ", args);

        if (args.type !== "tv") {
            return {metas: []};
        }

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

        return {metas: streams};
    });

    builder.defineStreamHandler(async (args) => {
        console.log("stream: ", args);

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

    builder.defineMetaHandler(async args => {
        console.log("meta: ", args);

        if (args.type !== "tv")
            return Promise.resolve({meta: {}});

        const displayname = args.id.split(":")[1].split("|")[1];
        const userStreamInfo = await dlive.getUserInfo(displayname);

        return {
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
                language: userStreamInfo.livestream.language.language
            }
        };
    });

    return builder.getInterface();
}

module.exports = init();
