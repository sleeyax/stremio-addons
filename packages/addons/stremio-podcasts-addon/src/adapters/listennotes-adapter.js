const BaseAdapter = require("./base-adapter");
const ListenNotes = require("../providers/listennotes");

class ListenNotesAdapter extends BaseAdapter{
    constructor() {
        super();
        this.provider = new ListenNotes(process.env.LISTEN_NOTES_API_KEY);
    }

    async getGenres() {
        return (await this.provider.getAllCategories()).genres.map(category => category.name);
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

    async getSummarizedMetaDataCollection(args) {
        const skip = args.extra.skip || 50;

        let collection = [];
        if (args.extra.search) {
            // search
            collection = await this.searchPodcasts(args.extra.search, skip);
        }else if (args.extra.genre != null) {
            // filter by genre
            const selectedGenre = (await this.provider.getAllCategories()).genres.find(category => category.name === args.extra.genre);
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
                genres: args.extra.genre || "Top",
                name: podcast.title,
                poster: podcast.thumbnail,
                posterShape: "square",
                background: podcast.image,
                logo: podcast.thumbnail,
                description: podcast.description
            }
        });
    }

    async getMetaData(args) {}

    async getStreams(args) {}

}

module.exports = ListenNotesAdapter;
