const request = require('request-promise');

class TorrentApi {
    static generateToken() {
        return request({
            uri: process.env.ENDPOINT,
            qs: {get_token: 'get_token', app_id: process.env.APP_ID},
            json: true,
            headers: {
                'User-Agent': process.env.USER_AGENT
            }
        });
    }

    queryAPI(mode, params = {}, format = 'json_extended') {
        params.app_id = process.env.APP_ID;
        params.token = process.env.TOKEN;
        params.sort = process.env.SORTING_METHOD;
        params.min_seeders = process.env.MIN_SEEDERS;
        params.min_leechers = process.env.MIN_LEECHERS;
        params.mode = mode;
        params.format = format;

        if (params.token == null)
            throw new Error('Token not found! Generate a new one and update your environment variables!');

        return request({
            uri: process.env.ENDPOINT,
            qs: params,
            json: true,
            headers: {
                'User-Agent': process.env.USER_AGENT
            }
        });
    }

    getList() {
        return this.queryAPI('list');
    }

    searchImdb(tt) {
        return this.queryAPI('search', {search_imdb: tt});
    }

    searchText(text) {
        return this.queryAPI('search', {search_string: text});
    }
}

module.exports = TorrentApi;
