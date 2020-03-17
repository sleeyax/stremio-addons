import { Manifest } from "stremio-addon-sdk";
const { version, description } = require('../package.json');

export default <Manifest>{
    id: 'com.sleeyax.redboxtv',
    name: 'RedBox TV',
    version,
    description,
    logo: 'https://i.imgur.com/5EhJ8iG.png',
    background: 'https://i.imgur.com/uVNqq6y.jpg',
    idPrefixes: ['rbtv'],
    types: ['tv'],
    resources: ['catalog', 'stream', 'meta'],
    catalogs: [
        {
            id: 'redboxtv',
            type: 'tv',
            name: 'RedBox TV',
            extra: [
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
        },
        {
            id: 'redboxtv-search',
            type: 'tv',
            name: 'RedBox TV',
            extra: [
                {
                    name: 'search',
                    isRequired: true
                },
            ]
        }
    ]
};