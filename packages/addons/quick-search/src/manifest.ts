import { Manifest, ContentType } from "stremio-addon-sdk";
const {description, version} = require('../package.json');

export default <Manifest>{
    id: 'com.sleeyax.stremio-quick-search',
    name: 'Quick Search',
    description,
    version,
    types: [ContentType.CHANNEL, ContentType.MOVIE, ContentType.SERIES, ContentType.TV],
    resources: ['catalog'],
    logo: 'https://i.imgur.com/yIgfnKC.png',
    catalogs: [
        {
            id: 'quick-search-channel',
            name: 'Instant Results',
            type: ContentType.CHANNEL,
            extra: [
                {
                    name: 'search',
                    isRequired: true
                }
            ],
        }
    ],
};