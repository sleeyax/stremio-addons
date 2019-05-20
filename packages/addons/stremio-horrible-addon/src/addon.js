const {addonBuilder} = require("stremio-addon-sdk");
const horribleSubs = require("./horriblesubs");
const {b64encode, b64decode, todayMinDays, base16decode, base16encode, base32decode} = require("./helpers");

module.exports = async () => {
	const manifest = {
		"id": "com.sleeyax.horrible-addon",
		"version": "0.0.1",
		"catalogs": [
			{
				"id": "horrible_catalog",
				"type": "series",
				"name": "HorribleSubs",
				"genres": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
				"extra": [{"name": "search", "isRequired": false}, {"name": "genre", "isRequired": false}, {"name": "skip", "isRequired": false}],
			}
		],
		"resources": ["catalog", "meta", "stream"],
		"types": ["series", "movie"],
		"name": "Anime from HorribleSubs",
		"logo": "",
		"background": "",
		"description": "Anime torrents from HorribleSubs",
		"idPrefixes": ["horrible_"]
	};
	const builder = new addonBuilder(manifest);

	builder.defineCatalogHandler(async args => {
		console.log("catalogs: ", args);

		let animes = [];
		if (args.extra.genre) {
			animes = await horribleSubs.getAnimes(args.extra.genre.toLowerCase(), args.extra.skip || 0, 50);
		}else if (args.extra.search){
			animes = await horribleSubs.searchAnimes(args.extra.search);
		}

		animes = animes.map(anime => {
			return {
				id: "horrible_" + b64encode(anime.url),
				type: "series",
				name: anime.title
			};
		});

		return {metas: animes};
	});

	builder.defineMetaHandler(async args => {
		console.log("meta: ", args);

		const url = b64decode(args.id.split("_")[1]);
		const animeInfo = await horribleSubs.getAnimeInfo(url);
		const episodes = await horribleSubs.getAnimeEpisodes(animeInfo.id);

		return Promise.resolve({
			meta: {
				id: "horrible_" + b64encode(animeInfo.id),
				type: "series",
				name: animeInfo.title,
				runtime: animeInfo.title,
				genres: ["Anime"],
				poster: animeInfo.picture,
				logo: animeInfo.picture,
				description: animeInfo.description,
				videos: episodes.reverse().map((episode, i) => {
					return {
						id: "horrible_" + animeInfo.id + "_" + episode.number,
						title: `${animeInfo.title} episode ${episode.number}`,
						episode: i + 1,
						season: 1,
						released: todayMinDays(episodes.length - i).toISOString() // TODO: fork & update api so we can scrape the real date
					}
				}),
			}
		});
	});

	builder.defineStreamHandler(async args => {
		console.log("streams: ", args);

		const animeId = args.id.split("_")[1];
		const episodeNr = args.id.split("_")[2];

		const selectedEpisode = (await horribleSubs.getAnimeEpisodes(animeId)).find(episode => episode.number === episodeNr);

		return Promise.resolve({
			streams: selectedEpisode.resolutions.map(resolution => {
				return {
					title: resolution.name,
					infoHash: base16encode(base32decode(
						resolution.magnet.substr(0, resolution.magnet.indexOf("&")).split(":")[3]
					))
				};
			})
		});
	});

	return builder.getInterface();
};
