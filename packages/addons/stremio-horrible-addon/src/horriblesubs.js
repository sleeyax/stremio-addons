const horribleSubsAPI = require("node-horriblesubs");

async function getAnimes(genre, min, max) {
    const animes = (await horribleSubsAPI.getAllAnime())
        .filter(anime => anime.title.substr(0, 1).toLowerCase() === genre)
        .slice(min, min + max);

    return animes;
}

async function getAnimeInfo(url) {
    return await horribleSubsAPI.getAnimeData(url);
}

async function getLatestAnime() {
    return await horribleSubsAPI.getLatestReleases();
}

async function getSeasonAnime() {
    return await horribleSubsAPI.getCurrentSeason();
}

async function getAnimeEpisodes(id) {
    return await horribleSubsAPI.getAnimeEpisodes(id);
}

async function searchAnimes(query) {
    return (await horribleSubsAPI.getAllAnime()).filter(anime => anime.title.toLowerCase().indexOf(query.toLowerCase()) > -1);
}

function formatDate(datesString) {
    switch (datesString.toLowerCase()) {
        case "today":
            return new Date().toISOString();
        case "yesterday":
            const d = new Date();
            d.setDate(d.getDate() - 1);
            return d.toISOString();
        default:
            return new Date(datesString).toISOString();
    }
}

module.exports = {
    getAnimeEpisodes,
    getAnimes,
    searchAnimes,
    getAnimeInfo,
    formatDate,
    getLatestAnime,
    getSeasonAnime
};
