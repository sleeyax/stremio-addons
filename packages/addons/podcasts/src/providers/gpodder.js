const request = require("request-promise");

class Gpodder {
    constructor() {
        this.url = "https://www.gpodder.net";
        this.api_v2 = `${this.url}/api/2`;
    }

    getAllCategories() {
        return this.sendGet(`${this.api_v2}/tags/99999999.json`);
    }

    convertToTag(title) {
        const regex = /[a-z-\d]+/gm;
        let result = [];

        let m;
        while ((m = regex.exec(title.toLowerCase())) !== null) {
            result.push(m[0]);
        }

        return result.join("-");
    }

    getPodCasts(category, count = 50) {
        category = this.convertToTag(category);
        return this.sendGet(`${this.api_v2}/tag/${category}/${count}.json`);
    }

    sendGet(url, json = true) {
        return request(url, {
            headers: {
                'User-Agent': 'Stremio podcasts addon'
            },
            json: true
        });
    }

    getTopPodcasts(count = 50) {
        return this.sendGet(`${this.url}/toplist/${count}.json`);
    }

    getPodcastFeed(url) {
        return this.sendGet(url, false);
    }

    getPodCastInfo(feedUrl) {
        return this.sendGet(`${this.api_v2}/data/podcast.json?url=${feedUrl}`);
    }

    searchPodCasts(searchTerm) {
        return this.sendGet(`${this.url}/search.json?q=${searchTerm}`);
    }
}

module.exports = Gpodder;
