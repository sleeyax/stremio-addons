const {version} = require('../package');

module.exports = {
    id: 'com.sleeyax.stremio-rarbg-torrents',
    name: 'RARBG Torrents',
    description: 'Watch movies & Series from RARBG',
    version: version,
    catalogs: [],
    background: '',
    logo: 'https://i.imgur.com/XHiqium.png',
    resources: ['stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt']
};
