import { Manifest } from "stremio-addon-sdk";
const {description, version} = require('../package.json');

export default <Manifest>{
    id: 'com.sleeyax.stremio-quick-search',
    name: 'Quick Search',
    description,
    version,
    types: ['channel', 'movie', 'series', 'tv'],
    resources: ['catalog'],
    logo: 'https://i.imgur.com/yIgfnKC.png',
    catalogs: [
        {
            id: 'quick-search-channel',
            name: 'Instant Results',
            type: 'channel',
            extra: [
                {
                    name: 'search',
                    isRequired: true
                }
            ],
        }
    ],
};