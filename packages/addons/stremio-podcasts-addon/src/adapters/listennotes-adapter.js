const BaseAdapter = require("./base-adapter");
const ListenNotes = require("../providers/listennotes");
const helpers = require("../helpers");

class ListenNotesAdapter extends BaseAdapter{
    constructor() {
        super();
        this.provider = new ListenNotes(process.env.LISTEN_NOTES_API_KEY);
    }

    async getGenres() {
        return (await this.provider.getAllCategories()).genres.map(category => category.name.replace("&", "and"));
    }

    /**
     * Translate an array of genre ids to an array of genre names
     * @param ids
     *
     */
    async idsToGenres(ids) {
        return (await this.provider.getAllCategories()).genres
            .filter(category => ids.indexOf(category.id) > -1)
            .map(category => category.name);
    }

    /**
     * Loop through all podcasts, until everything is found (infinite scroll)
     * @param skip
     * @param genre: null
     * @return {Promise<Array>}
     */
    async getPodcasts(skip, genre = null) {
        let page = Math.floor(skip / 50);
        let collection = [];
        let hasNext = false;
        do {
            const res = genre === null ? await this.provider.getTopPodcasts(page) : await this.provider.getPodCasts(genre, page);
            collection = collection.concat(res.podcasts);
            hasNext = res.has_next;
            page++;
        } while (hasNext && collection.length <= skip);

        return collection;
    }

    /**
     * Search specific podcast
     * @param query
     * @param skip
     * @return {Promise<Array>}
     */
    async searchPodcasts(query, skip) {
        let offset = 0;
        let collection = [];
        let total;
        do {
            const res = await this.provider.searchPodCasts(query, offset);
            collection = collection.concat(res.results);
            offset = res.nex_offset;
            total = res.total;
        } while (collection.length <= total && collection.length <= skip);

        return collection;
    }

    /**
     * Append ALL episodes to an existing podcast meta data object
     * This will keep calling the API until all episodes are retrieved
     * @param podcast
     * @return {Promise<*>}
     */
    async appendPodcastEpisodes(podcast) {
        let latest = podcast.latest_pub_date_ms;
        let next = podcast.next_episode_pub_date;

        while (latest > next) {
            const meta = await this.provider.getPodCastInfo(podcast.id, next);
            podcast.episodes = podcast.episodes.concat(meta.episodes);
            next = meta.next_episode_pub_date;
        }

        return podcast;
    }

    /**
     * Calculates the average episode length in minutes
     * @param episodes
     * @return number
     */
    calcAverageEpisodeLength(episodes) {
        let totalSeconds = 0;
        episodes.forEach(episode => {
            totalSeconds += episode.audio_length_sec;
        });

        return Math.floor((totalSeconds / episodes.length) / 60);
    }

    formatReleaseInfo(beginYear, endYear) {
        return beginYear === endYear ? beginYear : `${beginYear}-${endYear}`;
    }

    async getSummarizedMetaDataCollection(args) {
        const skip = args.extra.skip || 50;

        let collection = [];
        if (args.extra.search) {
            // search
            collection = await this.searchPodcasts(args.extra.search, skip);
        }else if (args.extra.genre != null) {
            // filter by genre
            const selectedGenre = (await this.provider.getAllCategories()).genres.find(category => category.name.replace("&", "and") === args.extra.genre);
            collection = await this.getPodcasts(skip, selectedGenre.id);
        }else{
            // top podcasts
            collection = await this.getPodcasts(skip);
        }

        // Nothing found
        if (collection.length === 0)
            return collection;

        return collection.map(podcast => {
            return {
                id: "podcasts_listennotes_" + podcast.id,
                type: "series",
                genres: [
                    `<strong>Episodes: </strong> ${podcast.total_episodes}`,
                    `<strong>Country: </strong> ${podcast.country}`,
                    `<strong>Language: </strong> ${podcast.language}`,
                    `<strong>Explicit content: </strong> ${podcast.explicit_content ? 'yes' : 'no'}`,
                    `<i>Powered by listen notes</i>`
                ],
                director: [podcast.publisher],
                releaseInfo: this.formatReleaseInfo(helpers.getFullYear(podcast.earliest_pub_date_ms), helpers.getFullYear(podcast.latest_pub_date_ms)),
                name: podcast.title,
                poster: podcast.thumbnail,
                posterShape: "square",
                background: podcast.image,
                logo: podcast.thumbnail,
                description: podcast.description,
            }
        });
    }

    async getMetaData(args) {
        const id = args.id.split("_")[2];
        const metadata = await this.appendPodcastEpisodes(await this.provider.getPodCastInfo(id));

        return Promise.resolve({
            meta: {
                id: args.id,
                type: "series",
                name: metadata.title,
                genres: await this.idsToGenres(metadata.genre_ids),
                runtime: `${ this.formatReleaseInfo(helpers.getFullYear(metadata.earliest_pub_date_ms), helpers.getFullYear(metadata.latest_pub_date_ms))} | Average episode length: ${this.calcAverageEpisodeLength(metadata.episodes)} minutes`,
                poster: metadata.thumbnail,
                posterShape: "square",
                background: metadata.image,
                logo: metadata.thumbnail,
                description: metadata.description,
                videos: metadata.episodes.map((episode, i) => {
                    return {
                        id: "podcasts_listennotes_" + episode.id,
                        title: episode.title,
                        released: new Date(episode.pub_date_ms).toISOString(),
                        season: 1,
                        episode: i + 1,
                        thumbnail: episode.thumbnail,
                        streams: [{url: episode.audio}],
                        overview: episode.description
                    }
                }),
                director: metadata.publisher,
                language: metadata.language,
                country: metadata.country,
                website: metadata.website
            }
        });
    }

    async getStreams(args) {}

}

module.exports = ListenNotesAdapter;
