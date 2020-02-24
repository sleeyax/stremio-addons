import { Manifest, ContentType } from 'stremio-addon-sdk';
const {description, version} = require('../package.json');

export default <Manifest>{
    id: 'com.sleeyax.stremio-help',
    name: 'Help',
    description,
    version,
    types: ['help', ContentType.MOVIE],
    resources: ['catalog', 'stream'],
    background: 'https://www.stremio.com/website/wallpapers/stremio-wallpaper-5.jpg',
    logo: 'https://i.imgur.com/AdiPPkf.png',
    catalogs: [
        {
            id: 'communities-catalog',
            name: 'Communities',
            type: 'help'
        }
    ],
    idPrefixes: ['help']
};
