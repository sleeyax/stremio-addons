import needle, {NeedleResponse} from 'needle';

const urls = [
    // TODO: choose sources using UI
    'https://more-milk.xyz/661MyMwAqRbc.com.sleeyax.stremio-1337x-torrents/manifest.json',
    // 'https://stremio-yts.joaolvcm.now.sh',
    // 'https://thepiratebay-plus.now.sh',
    'https://more-milk.xyz/661MyMwAqRbc.com.sleeyax.stremio-rarbg-torrents/manifest.json'
];

export async function getAllStreams(imdbid: string, type: string = 'movie') {
    const streamPromises = urls.map(url => needle('get', `${url}/stream/${type}/${imdbid}.json`));
    const streams = await Promise.all(streamPromises)
        .then((results: NeedleResponse[]) => results
            .map(result => result.body.streams || [])
            .reduce((acc, val) => acc.concat(val), []))
        .catch(err => console.error(err));

    return streams;
}
