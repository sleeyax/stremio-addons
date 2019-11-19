const {version, description} = require('../package');

module.exports = {
    id: 'com.sleeyax.stremio-rarbg-torrents',
    name: 'RARBG Torrents',
    description: description,
    version: version,
    catalogs: [],
    background: '',
    logo: 'https://i.imgur.com/XHiqium.png',
    resources: ['stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt']
};
