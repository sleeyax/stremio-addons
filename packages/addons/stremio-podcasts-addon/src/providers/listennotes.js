const request = require("request-promise");

class ListenNotes {
    constructor(apiKey) {
        this.headers = {
            "X-ListenAPI-Key": apiKey
        };
        this.url = "https://listen-api.listennotes.com";
        this.api_v2 = `${this.url}/api/v2`;
    }

    getAllCategories() {
        return require("../../cache/listennotes-genres");
    }

    getAllRegions() {
        return require("../../cache/listennotes-regions");
    }

    getPodCasts(genreId, page = 1) {
        return this.queryAPI("/best_podcasts",{genre_id: genreId, page: page});
    }

    getTopPodcasts(page = 1) {
        return this.queryAPI("/best_podcasts",  {page});
    }

    searchPodCasts(searchTerm, offset = 0) {
        return this.queryAPI("/search", {q: searchTerm, offset: offset});
    }

    getPodCastInfo(id, nextPubDate = null) {
        return nextPubDate == null ?
            this.queryAPI("/podcasts/" + id, {sort: "oldest_first"}) :
            this.queryAPI("/podcasts/" + id, {next_episode_pub_date: nextPubDate, sort: "oldest_first"});
    }

    getEpisodes(id) {
        return this.queryAPI("/episodes/" + id);
    }

    getRandomPodcast() {
        return this.queryAPI("/just_listen");
    }

    queryAPI(route, params) {
        return this.sendGet(`${this.api_v2}${route}`, params);
    }

    sendGet(url, params) {
        return request(url, {
            method: "GET",
            headers: this.headers,
            qs: params,
            json: true
        });
    }
}

module.exports = ListenNotes;
