const request = require('request-promise');

class TorrentApi {
    /**
     * Torrent API constructor
     * @param {string} appId
     * @param {string} token
     */
    constructor(appId, token) {
        this.appId = appId;
        this.token = token;
    }

    /**
     * Get a new token
     * @param {string} appId
     */
    static getToken(appId) {
        return request({
            uri: process.env.ENDPOINT,
            qs: {get_token: 'get_token', app_id: appId},
            json: true,
            headers: {
                'User-Agent': process.env.USER_AGENT
            }
        });
    }

    /**
     * Query the API
     * @param {string} mode
     * @param {object} params
     * @param {string} format
     */
    async queryAPI(mode, params = {}, format = 'json_extended') {
        if (this.token == null || this.appId == null) throw new Error('Token and/or appid can\'t be null!');

        params.app_id = this.appId;
        params.token = this.token;
        params.sort = process.env.SORTING_METHOD || 'seeders';
        params.min_seeders = process.env.MIN_SEEDERS || 10;
        params.min_leechers = process.env.MIN_LEECHERS || 0;
        params.limit = process.env.MAX_RESULTS || 25;
        params.mode = mode;
        params.format = format;

        return request({
            uri: process.env.ENDPOINT, qs: params, json: true, headers: {
                'User-Agent': process.env.USER_AGENT
            }
        }).then(res => res.torrent_results);
    }

    getList() {
        return this.queryAPI('list');
    }

    /**
     * Search for results using imdb id
     * @param tt imdb id
     * @param {array} categories
     */
    searchImdb(tt, categories = null) {
        const params = {search_imdb: tt};
        if (categories)
            params['category'] = categories.join(';');
        return this.queryAPI('search', params);
    }

    searchText(text) {
        return this.queryAPI('search', {search_string: text});
    }
}

module.exports = TorrentApi;
