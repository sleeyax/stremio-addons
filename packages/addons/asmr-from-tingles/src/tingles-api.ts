import needle, { NeedleResponse } from 'needle';
import ITrigger from './models/trigger';
import IVideo from './models/video';
import IArtist from './models/artist';

export default class TinglesApi {
    private readonly _url = 'https://tingles.freetls.fastly.net';
    private readonly _headers = {
        'User-Agent': 'okhttp/3.12.3',
        'Platform': 'Android'
    };

    /**
     * Send a GET request to specified URL path
     * @param path 
     */
    private _get(path: string) {
        return needle('get', `${this._url}/${path}`, {headers: this._headers});
    }

    /**
     * Get a list of all available triggers on the platform
     * 
     * e.g no talking, gf roleplays, hand sounds, ...
     */
    async getTriggers(): Promise<ITrigger[]> {
        let result: ITrigger[] = [];
        let token = 0;
        while (token != null) {
            const response = await this._get('1/triggers?pageToken=' + token);
            result = result.concat(response.body.items)
            token = response.body.nextPageToken;
        }
        return result;
    }

    /**
     * Get all videos for a specific trigger
     * @param triggerUUID 
     */
    getVideos(triggerUUID: string): Promise<IVideo[]> {
        return this._get(`1/trigger/${triggerUUID}/videos`)
            .then(r => r.body);
    }

    /**
     * Get recent uploads of an ASMR artist
     * @param artistUUID 
     */
    getArtistVideos(artistUUID): Promise<IVideo[]> {
        return this._get(`4/artist/${artistUUID}/videos?type=recent`)
            .then(r => r.body)
            .then(body => body.items.find(item => item.itemType == 'video').items);
    }

    /**
     * Get details about a single video
     * @param videoUUID 
     */
    getVideoInfo(videoUUID: string): Promise<IVideo> {
        return this._get('1/video/' + videoUUID)
            .then(r => r.body);
    }

    /**
     * Get all available stream sources for specified video
     * @param videoUUID 
     */
    getStreams(videoUUID: string): Promise<any> {
        return this._get(`2/video-stream/${videoUUID}?returnAll=true`)
            .then(r => r.body);
    }

    /**
     * Get details about an asmrtist
     * @param artistUUID 
     */
    getArtistInfo(artistUUID: string): Promise<IArtist> {
        return this._get('1/artist/' + artistUUID)
            .then(r => r.body);
    }

    /**
     * Search ASMR videos
     * @param query 
     */
    search(query: string): Promise<{playlists: IVideo[], videos: IVideo[], artists: IArtist[]}> {
        return this._get('4/search?term=' + query)
            .then(r => r.body)
            .then(body => ({
                playlists: body.items.find(item => item.itemType == 'playlist').items,
                videos: body.items.find(item => item.itemType == 'video').items,
                artists: body.items.find(item => item.itemType == 'artist').items,
            }));
    }

    /**
     * Get best of the week videos
     */
    getBestOfTheWeek(): Promise<IVideo[]> {
        return this._get('1/trigger/6729b844-77b6-4325-9488-5de8974817f1/videos')
            .then(r => r.body);
    }
}