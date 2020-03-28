const BaseAdapter = require("./base-adapter");
const Gpodder = require("../providers/gpodder");
const feedParser = require("podcast-feed-parser");
const {b64decode, b64encode, toHumanReadableFileSize} = require("../helpers");

class GpodderAdapter extends BaseAdapter{
    constructor() {
        super();
        this.provider = new Gpodder();
    }

    /**
     * Returns all genres to be used in the manifest
     * @return {Promise<Uint8Array | BigInt64Array | *[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array>}
     */
    async getGenres() {
        return (await this.provider.getAllCategories()).map(category => category.title);
    }

    /**
     * Summarized collection of meta items
     * @param args
     * @return {Promise<Uint8Array | BigInt64Array | {genres: (*|string), background: *, name: *, posterShape: string, logo: *, description: string | string, id: string, type: string, poster: *}[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array>}
     */
    async getSummarizedMetaDataCollection(args) {
        const count = args.extra.skip || 50;

        let podcasts = args.extra.search ? await this.provider.searchPodCasts(args.extra.search) :
            args.extra.genre != null ? await this.provider.getPodCasts(args.extra.genre, count) : await this.provider.getTopPodcasts(count);

        let metas = podcasts.map(podcast => {
            return {
                id: "podcasts_gpodder_" + b64encode(podcast.url),
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

        return metas;
    }

    /**
     * Detailed description of meta item
     * @param args
     * @return {Promise<{meta: {website: ((existingPath: PathLike, newPath: PathLike, callback: (err: (NodeJS.ErrnoException | null)) => void) => void) | ((existingPath: PathLike, newPath: PathLike) => Promise<void>) | link | ((url: string) => string) | string, director: string[], description: *, videos: {id: string, title: *, released: Date}[], language: *, type: string, background: (exports.GET.imageURL|imageURL|exports.CLEAN.imageURL|string), name: *, genre: string | string[] | exports.GET.categories | categories, posterShape: string, logo: (exports.GET.imageURL|imageURL|exports.CLEAN.imageURL|string), id: *, poster: (exports.GET.imageURL|imageURL|exports.CLEAN.imageURL|string)}}>}
     */
    async getMetaData(args) {
        const url = b64decode(args.id.split("_")[2]);
        const feed = await feedParser.getPodcastFromFeed(await this.provider.getPodcastFeed(url));

        return Promise.resolve({
            meta: {
                id: args.id,
                type: "channel",
                name: feed.meta.title,
                genres: feed.meta.categories,
                poster: feed.meta.imageURL,
                posterShape: "square",
                background: feed.meta.imageURL,
                logo: feed.meta.imageURL,
                description: feed.meta.description,
                videos: feed.episodes.map(episode => {
                    return {
                        id: "podcasts_gpodder_" + b64encode(JSON.stringify(episode.enclosure)),
                        title: episode.title,
                        released: new Date(episode.pubDate)
                    }
                }),
                director: [feed.meta.owner.name],
                language: feed.meta.language,
                website: feed.meta.link
            },
            cacheMaxAge: 3 * (24 * 3600)
        });
    }

    /**
     * Tells Stremio how to obtain the media content
     * @param args
     * @return {Promise<{streams: {title: string, url: *}[]}>}
     */
    async getStreams(args) {
        const episode = JSON.parse(b64decode(args.id.split("_")[2]));

        return Promise.resolve({
            streams: [
                {
                    url: episode.url,
                    title: `${episode.type} (${toHumanReadableFileSize(episode.length)})`
                }
            ],
            cacheMaxAge: 3 * (24 * 3600)
        });
    }
}

module.exports = GpodderAdapter;
