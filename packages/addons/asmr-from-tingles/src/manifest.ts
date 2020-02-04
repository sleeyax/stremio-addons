import { Manifest, ContentType } from 'stremio-addon-sdk';
import TinglesApi from './tingles-api';
const { version, description } = require('../package.json');

export default function createManifest(genres: string[]) {
    return <Manifest>{
        id: 'com.sleeyax.asmr-tingles',
        name: 'ASMR from Tingles',
        description,
        version,
        logo: 'https://i.imgur.com/hH5oekj.png',
        background: 'https://i.imgur.com/H4nPP6Q.jpg',
        types: [ContentType.MOVIE, ContentType.CHANNEL, 'ASMR'],
        idPrefixes: ['tingles'],
        resources: ['catalog', 'meta', 'stream'],
        catalogs: [
            {
                id: 'tingles-triggers-catalog',
                name: 'Videos',
                type: 'ASMR',
                extra: [
                    {
                        name: 'genre',
                        isRequired: false,
                        options: genres,
                    },
                    {
                        name: 'search',
                        isRequired: false
                    }
                ]
            },
            {
                id: 'tingles-artists-catalog',
                name: 'Artists',
                type: 'ASMR',
                extra: [
                    {
                        name: 'search',
                        isRequired: true
                    }
                ]
            }
        ]
    };
}

