const needle = require('needle');


class CinemetaProxy {
    constructor(useHttps) {
        this.url = 'http' + (useHttps ? 's' : '') +'://v3-cinemeta.strem.io';
    }

    getMeta(imdbid, type) {
        return needle('GET', `${this.url}/meta/${type}/${imdbid}.json`)
            .then(res => res.body);
    }
}

module.exports = CinemetaProxy;
