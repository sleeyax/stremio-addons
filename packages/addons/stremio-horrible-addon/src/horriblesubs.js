const horribleSubsAPI = require("node-horriblesubs");
const fs = require("fs");

async function getAnimes(genre, min, max) {
    const animes = (await horribleSubsAPI.getAllAnime())
        .filter(anime => anime.title.substr(0, 1).toLowerCase() === genre)
        .slice(min, min + max);

    return animes;
}

async function getAnimeInfo(url) {
    // create cache if it doesn't exist yet
    const cacheLocation = "src/catalog-cache.json";
    if (!fs.existsSync(cacheLocation))
        fs.writeFileSync(cacheLocation, "[]");

    // check if the catalog item is cached
    const cache = require("./catalog-cache");
    let animeData = cache.find(item => item.url === url);

    // item is not available in cache, retrieve it from server & store it
    if (animeData === undefined) {
        animeData = await horribleSubsAPI.getAnimeData(url);
        cache.push(animeData);
        fs.writeFileSync(cacheLocation, JSON.stringify(cache));
    }

    return animeData;

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
