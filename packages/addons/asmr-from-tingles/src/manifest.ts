import { Manifest } from 'stremio-addon-sdk';
const { version, description } = require('../package.json');

export default function createManifest(genres: string[]) {
    //@ts-ignore
    return <Manifest>{
        id: 'com.sleeyax.asmr-tingles',
        name: 'ASMR from Tingles',
        description,
        version,
        logo: 'https://i.imgur.com/hH5oekj.png',
        background: 'https://i.imgur.com/H4nPP6Q.jpg',
        types: ['movie', 'channel', 'ASMR'],
        idPrefixes: ['tingles'],
        resources: ['catalog', 'meta', 'stream'],
        catalogs: [
            {
                id: 'tingles-triggers-catalog',
                name: 'Tingles',
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

