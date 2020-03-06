const needle = require('needle');


class CinemetaProxy {
    constructor() {
        this.url = 'https://v3-cinemeta.strem.io';
    }

    getMeta(imdbid, type) {
        return needle('GET', `${this.url}/meta/${type}/${imdbid}.json`)
            .then(res => res.body);
    }
}

module.exports = CinemetaProxy;
