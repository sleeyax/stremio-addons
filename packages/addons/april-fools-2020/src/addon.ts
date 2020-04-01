import {addonBuilder} from 'stremio-addon-sdk';
import manifest from './manifest';

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(_ => Promise.resolve({streams: [
    {
        name: 'low',
        title: 'NETFLIX FOR FREE',
        ytId: 'dQw4w9WgXcQ'
    },
    {
        name: 'medium',
        title: 'NETFLIX FOR FREE',
        ytId: 'dQw4w9WgXcQ'
    },
    {
        name: 'high',
        title: 'NETFLIX FOR FREE',
        ytId: 'dQw4w9WgXcQ'
    }
]}));

export default builder.getInterface();