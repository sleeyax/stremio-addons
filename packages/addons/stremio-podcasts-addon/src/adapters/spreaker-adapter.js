const BaseAdapter = require("./base-adapter");
const Spreaker = require("../providers/spreaker");

class SpreakerAdapter extends BaseAdapter {
    constructor() {
        super();
        this.provider = new Spreaker();
        this.storage = {};
    }

    async getGenres() {
        const categories = await this.provider.getAllCategories();
        return ["Featured", "Popular"].concat(categories.response.categories
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
        let shows = null;

        if (skip == null)
            this.storage.nextUrl = undefined;

        // The Spreaker API doesn't support offsets for pagination, so just store the nex page URL (next_url) in a private variable so we can recall it later.
        shows = (this.storage.nextUrl !== undefined) ? await this.provider.sendGet(this.storage.nextUrl) : await this.provider.getShows(genreId, 50);
        this.storage.nextUrl = shows.response.next_url;

        return shows;
    }

    async getSummarizedMetaDataCollection(args) {

        let shows = [];

        if (args.extra.genre) {
            // genre
            switch (args.extra.genre) {
                case "Featured":
                    shows = await this.provider.getFeatured();
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

    async getMetaData(args) {}

    async getStreams(args) {}
}

module.exports = SpreakerAdapter;
