import { Manifest } from "stremio-addon-sdk";
const {version, description} = require('../package.json');
import XnxxApi from './api/xnxx';

const xnxx = new XnxxApi();

export default async (): Promise<Manifest> => ({
    id: 'com.sleeyax.xnxx',
    name: 'XNXX',
    description,
    version,
    types: ['movie'],
    resources: ['catalog', 'meta', 'stream'],
    behaviorHints: {
        adult: true
    },
    logo: '../assets/logo.png',
    background: '../assets/background.png',
    catalogs: [
        {
            id: 'categories',
            name: 'XNXX',
            type: 'movie',
            extra: [
                {
                    name: 'genre',
                    isRequired: true,
                    options: (await xnxx.getAllCategories()).map(cat => cat.name)
                }
            ]
        }
    ],
    idPrefixes: ['xnxx']
});