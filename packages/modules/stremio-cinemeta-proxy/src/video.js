const CinemetaProxy = require('./cinemeta');

class Video {
    constructor(id, opts = {useHttps: true}) {
        const splitted = id.split(':');

        this.imdbid = splitted[0];
        if (splitted.length === 3) {
            this.season = Number.parseInt(splitted[1]);
            this.episode = Number.parseInt(splitted[2]);
        } else if (id.indexOf(':') > -1) {
            throw new Error(`Invalid VideoID: ${id}. Expected format: imdbid:season:episode`);
        }
        this.api = new CinemetaProxy(opts.useHttps);
    }

    getType() { return this.season !== undefined ? 'series' : 'movie';}
    isSeries() { return this.getType() === 'series'; }
    isMovie() { return this.getType() === 'movie';}

    /**
     * Get all meta info about the movie or series
     * @return {Promise<boolean>}
     */
    getFullMetaDetails() {
        return this.api.getMeta(this.imdbid, this.getType())
            .then(details => details.meta);
    }

    /**
     * Get basic info about the movie or series
     * If it's a series, includes human readable episode name
     * If it's a movie, includes the human readable movie name
     */
    async getInfo() {
        const meta = await this.getFullMetaDetails();
        const details = {
            imdbid: meta.imdb_id,
            name: meta.name,
            year: meta.year
        };

        if (this.isSeries()) {
            const episodeDetails = meta.videos.find(video => video.season == this.season && video.episode == this.episode);
            details.episode = {
                name: episodeDetails.name,
                season: episodeDetails.season || this.season,
                number: episodeDetails.episode || episodeDetails.number || this.episode
            };
        }

        return details;
    }
}

module.exports = Video;
