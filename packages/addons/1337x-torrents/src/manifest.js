const {version, description} = require('../package');

module.exports = {
    id: 'com.sleeyax.stremio-1337x-torrents',
    name: '1337x torrents',
    description,
    version,
    catalogs: [],
    background: 'https://i.imgur.com/VdZ31QD.png',
    logo: 'https://i.imgur.com/4EzjAR1.png',
    resources: ['stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt']
};
