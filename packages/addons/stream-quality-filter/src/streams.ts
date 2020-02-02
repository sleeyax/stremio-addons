import needle, {NeedleResponse} from 'needle';

const urls = [
    'https://stremio-1337x-addon.sleeyax.now.sh',
    'https://stremio-yts.joaolvcm.now.sh',
    'https://thepiratebay-plus.now.sh',
    'https://stremio-rarbg-addon-dev.sleeyax.now.sh'
];

export async function getAllStreams(imdbid: string, type: string = 'movie') {
    const streamPromises = urls.map(url => needle('get', `${url}/stream/${type}/${imdbid}.json`));
    const streams = await Promise.all(streamPromises)
        .then((results: NeedleResponse[]) => results
            .map(result => result.body.streams)
            .reduce((acc, val) => acc.concat(val), []));
    return streams;
}
