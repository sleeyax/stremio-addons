const request = require("request-promise");
const querystring = require('querystring');

class ListenNotes {
    constructor(apiKey) {
        this.headers = {
            "X-ListenAPI-Key": apiKey
        };
        this.url = "https://listen-api.listennotes.com";
        this.api_v2 = `${this.url}/api/v2`;
    }

    getAllCategories() {
        return this.queryAPI("/genres");
    }

    queryAPI(route, params) {
        return this.sendGet(`${this.api_v2}${route}`, params);
    }

    sendGet(url, params) {
        return request(url, {
            method: "GET",
            headers: this.headers,
            body: querystring.stringify(params),
        });
    }
}

module.exports = ListenNotes;
