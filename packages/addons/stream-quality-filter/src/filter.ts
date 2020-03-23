import { Stream } from "stremio-addon-sdk";
import { findAnyOf } from "./helpers";

export const defaultFilters: Filter[] = [
    {name: '3d', humanReadableName: '3D'}, 
    {name: '4k', humanReadableName: '4k'}, 
    {name: 'uhd', humanReadableName: '4K'}, 
    {name: '2160p', humanReadableName: '4K'}, 
    {name: '1080p', humanReadableName: '1080P'}, 
    {name: 'hdrip', humanReadableName: 'HDRIP'}, 
    {name: 'web-dl', humanReadableName: 'WEB-DL'}, 
    {name: 'hdtv', humanReadableName: 'HD TV'}, 
    {name: '720p', humanReadableName: '720P'}, 
    {name: 'uh480p', humanReadableName: '480P'}, 
    {name: 'cam', humanReadableName: 'CAM'},
];

/**
 * Convert string of filters to list of actual Filters
 * @param filters 
 */
export function extractFilters(filters: string, delimeter: string = ','): Filter[] {
    const splitted = filters.split(delimeter);
    return splitted.map(name => {
        let result = defaultFilters.find(filter => filter.name == name);
        return result ? result : {name, humanReadableName: name.toUpperCase()};
    });
}

interface Filter {
    name: string,
    humanReadableName: string
}

export default class StreamFilter {
    private filters: Filter[];

    constructor(filters?: Filter[]) {
        this.filters = filters ? filters : defaultFilters;
    }

    /**
     * Get filter by name
     * @param name 
     */
    private getFilter(name: string) {
        return this.filters.find(filter => filter.name == name);
    }

    /**
     * Apply the filter to given streams
     * @param streams 
     */
    apply(streams: Stream[], removeUnknown?: boolean) {
        const rawFilters = this.filters.map(filter => filter.name);

        streams = streams.sort((c, a) => {
            // map quality (found in the title) to an index (based on filters above) to make comparison easier
            const k = findAnyOf(c.title, rawFilters).index;
            const e = findAnyOf(a.title, rawFilters).index;
            
            // compare qualities
            if (k < e) return -1;
            else if (k > e) return 1;
            else return 0;
            
        })
        // remove broken streams & duplicates
        .filter((stream, i, self) => stream && stream.infoHash && i === self.findIndex(s => s.infoHash == stream.infoHash && s.fileIdx == stream.fileIdx))
        .map(stream => <Stream>({
            ...stream,
            name: (this.getFilter(findAnyOf(stream.title, rawFilters).value) || {}).humanReadableName || 'unknown',
            title: `[${stream.name}] ${stream.title}`
        }));

        if (removeUnknown)
            streams = streams.filter(stream => stream.name.toLowerCase() != 'unknown');

        return streams;
    }
}