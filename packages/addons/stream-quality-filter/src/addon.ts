import {addonBuilder, Stream} from 'stremio-addon-sdk';
import Manifest from './manifest';
import {getAllStreams} from './streams';

const builder = new addonBuilder(Manifest);

/**
 * Check if a string contains text from an array of substrings. 
 * Returns the value and index of the found item.
 * @param text target text to search
 * @param arr values to search for
 */
function findAnyOf(text: string, arr: string[]) {
    for (let i = 0; i < arr.length; i++) {
        const value = arr[i];
        if (text.toLowerCase().indexOf(value) > -1) return {value, index: i};
    }
    return {value: null, index: arr.length};
}

function getName(filter: string) {
    switch (filter) {
        case 'uhd':
        case '2160p':
            return '4k';
        default:
            return filter;
    }
}

builder.defineStreamHandler(async ({id, type}) => {
    // get all streams from our sources
    const allStreams: Stream[] = await getAllStreams(id, type);
    
    const filters = ['3d', '4k', 'uhd', '2160p', '1080p', 'hdrip', 'web-dl', 'hdtv', '720p', '480p', 'cam'];
    
    const streams = allStreams.sort((c, a) => {
        // map quality (found in the title) to an index (based on filters above) to make comparison easier
        const k = findAnyOf(c.title, filters).index;
        const e = findAnyOf(a.title, filters).index;
        
        // compare qualities
        if (k < e) return -1;
        else if (k > e) return 1;
        else return 0;
        
    })
    // remove broken streams & duplicates
    .filter((stream, i, self) => stream && stream.infoHash && i === self.findIndex(s => s.infoHash == stream.infoHash && s.fileIdx == stream.fileIdx))
    .map(stream => <Stream>({
        ...stream,
        name: (getName(findAnyOf(stream.title, filters).value || 'unknown')).toUpperCase(),
        title: `[${stream.name}] ${stream.title}`
    }));    

    return Promise.resolve({ streams, cacheMaxAge: 24 * 3600 * 3 });
});

export default builder.getInterface();
