const horribleSubsAPI = require("node-horriblesubs");
const fs = require("fs");

async function getAnimes(genre, min, max) {
    const animes = (await horribleSubsAPI.getAllAnime())
        .filter(anime => anime.title.substr(0, 1).toLowerCase() === genre)
        .slice(min, min + max);

    return animes;
}

async function getAnimeInfo(url) {
    return await horribleSubsAPI.getAnimeData(url);
}

async function getAnimeEpisodes(id) {
    return await horribleSubsAPI.getAnimeEpisodes(id);
}

async function searchAnimes(query) {
    return (await horribleSubsAPI.getAllAnime()).filter(anime => anime.title.toLowerCase().indexOf(query.toLowerCase()) > -1);
}

module.exports = {
    getAnimeEpisodes,
    getAnimes,
    searchAnimes,
    getAnimeInfo
};
