const BaseAdapter = require("./base-adapter");
const Spreaker = require("../providers/spreaker");
const {calcAverage} = require("../helpers");

class SpreakerAdapter extends BaseAdapter {
    constructor() {
        super();
        this.provider = new Spreaker();
        this.storage = {};
    }

    async getGenres() {
        const categories = await this.provider.getAllCategories();
        return ["Popular", "Recommended"].concat(categories.response.categories
            .map(category => category.name.replace("&", "And"))
            .sort()
        );
    }

    /**
     * Returns all shows (podcasts) for specified genre/category
     * @param genreId
     * @param skip
     */
    async getShows(genreId, skip) {
        if (skip == null)
            this.storage.nextUrl = undefined;

        // The Spreaker API doesn't support offsets for pagination, so just store the nex page URL (next_url) in a private variable so we can recall it later.
        let shows = (this.storage.nextUrl !== undefined) ? await this.provider.sendGet(this.storage.nextUrl) : await this.provider.getShows(genreId, 50);
        this.storage.nextUrl = shows.response.next_url;

        return shows;
    }

    async getEpisodes(showId) {
        let episodes = await this.provider.getEpisodes(showId);
        let next = episodes.response.next_url;
        while (next !== null) {
            const nextEpisodes = await this.provider.sendGet(next);
            episodes.response.items = episodes.response.items.concat(nextEpisodes.response.items);
            next = nextEpisodes.response.next_url;
        }

        return episodes;
    }

    async getSummarizedMetaDataCollection(args) {

        let shows = [];

        if (args.extra.genre) {
            // genre
            switch (args.extra.genre) {
                case "Recommended":
                    shows = await this.provider.getRecommended();
                    break;
                case "Popular":
                    shows = await this.provider.getPopular();
                    break;
                default:
                    const selectedGenre = (await this.provider.getAllCategories()).response.categories
                        .find(category => category.name.replace("&", "And") === args.extra.genre);
                    shows = await this.getShows(selectedGenre.category_id, args.extra.skip);
                    break;
            }
        }else if (args.extra.search) {
            // search
            shows = await this.provider.searchShows(args.extra.search);
        }else{
            // top
            shows = await this.provider.getTopShows();
        }

        return shows.response.items.map(show => {
            return {
                id: "podcasts_spreaker_" + show.show_id,
                type: "series",
                genres: args.extra.genre || "Top",
                name: show.title,
                description: show.title,
                poster: show.image_url,
                posterShape: "square",
                background: show.image_original_url,
                logo: show.image_url
            }
        });
    }

    async getMetaData(args) {
        const showId = args.id.split("_")[2];
        const details = (await this.provider.getShowDetails(showId)).response.show;
        const episodes = await this.getEpisodes(details.show_id);

        return Promise.resolve({
            meta: {
                id: args.id,
                type: "series",
                name: details.title,
                genres: [(await this.provider.getAllCategories()).response.categories
                    .find(category => category.category_id === details.category_id).name
                    .replace("&", "And")],
                poster: details.original_image_url,
                posterShape: "square",
                background: details.cover_image_url || details.image_original_url,
                logo: details.image_url,
                description: details.description,
                videos: episodes.response.items.map((episode, i) => {
                    return {
                        id: "podcasts_spreaker_" + episode.episode_id,
                        title: episode.title,
                        released: new Date(episode.published_at).toISOString(),
                        season: 1,
                        episode: i + 1,
                    }
                }),
                director: [details.author.username || details.author.fullname],
                language: details.language,
                website: details.website_url,
                runtime: `Average episode length: ${Math.floor((calcAverage(episodes.response.items.map(episode => episode.duration)) / 60) / 1000)} minutes`
            },
            cacheMaxAge: 3 * (24 * 3600)
        });
    }

    async getStreams(args) {
        const episodeId = args.id.split("_")[2];
        const episode = (await this.provider.getEpisode(episodeId)).response.episode;

        return Promise.resolve({
            streams:
                [{
                    url: episode.playback_url,
                    title: "audio"
                },
                {
                    externalUrl: episode.site_url,
                    title: "source"
                },
                {
                    externalUrl: episode.download_url,
                    title: "download"
                },
                {
                    externalUrl: episode.waveform_url,
                    title: "waveform"
                }],
            cacheMaxAge: 3 * (24 * 3600)
        });
    }
}

module.exports = SpreakerAdapter;
