import { Manifest, ContentType } from "stremio-addon-sdk";
const { version, description } = require('../package.json');

export default <Manifest>{
    id: 'com.sleeyax.redboxtv',
    name: 'RedBox TV',
    version,
    description,
    idPrefixes: ['rbtv'],
    types: [ContentType.TV],
    resources: ['catalog', 'stream'],
    catalogs: [
        {
            id: 'redboxtv',
            type: ContentType.TV,
            name: 'RedBox TV',
            extra: [
                {
                    name: 'search',
                    isRequired: false
                },
                {
                    name: 'genre',
                    isRequired: true,
                    options: [] // options will be populated later on
                },
                {
                    name: 'skip',
                    isRequired: false
                }
            ]
        }
    ]
};