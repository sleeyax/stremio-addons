const request = require("request-promise");

class Spreaker {
    constructor() {
        this.url = "https://api.spreaker.com";
        this.api_v2 = `${this.url}/v2`;
    }

    getAllCategories() {
        return this.queryAPI("/show-categories");
    }

    queryAPI(path) {
        return this.sendGet(`${this.api_v2}${path}`);
    }

    sendGet(url, json = true) {
        return request(url, {
            headers: {
                'User-Agent': 'Stremio podcasts addon'
            },
            json: true
        });
    }

    searchShows(query) {
        return this.queryAPI(`/search?type=shows&q=${query}&limit=50`);
    }

    getShowDetails(showId) {
        return this.queryAPI("/shows/" + showId);
    }

    getEpisodes(showId) {
        return this.queryAPI(`/shows/${showId}/episodes?sorting=oldest&limit=100`);
    }

    getEpisode(episodeId) {
        return this.queryAPI("/episodes/" + episodeId);
    }

    getShows(categoryId, count, lastId = null) {
        return this.queryAPI(`/explore/categories/${categoryId}/items?limit=${count}` + (lastId ? `&last_id=${lastId}` : ""));
    }

    getTopShows() {
        return this.queryAPI("/explore/lists/211/items");
    }

    getRecommended() {
        return this.queryAPI("/explore/lists/108/items");
    }

    getPopular() {
        return this.queryAPI("/explore/lists/214/items");
    }
}

module.exports = Spreaker;
