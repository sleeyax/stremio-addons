const request = require("request-promise");
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class ListenNotes {
    constructor(apiKey) {
        this.headers = {
            "X-ListenAPI-Key": apiKey
        };
        this.url = "https://listen-api.listennotes.com";
        this.api_v2 = `${this.url}/api/v2`;
    }

    getAllCategories() {
        const genres = "cache/listennotes-genres.json";

        // Load genres from cache or retrieve them from the API
        if (fs.existsSync(genres)) {
            return readFile(genres).then(text => JSON.parse(text));
        }else{
            return this.queryAPI("/genres").then(async res => {
                await writeFile(genres, JSON.stringify(res));
                return res;
            });
        }
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
