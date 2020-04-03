import {addonBuilder} from 'stremio-addon-sdk';
import loadManifest from './manifest';
import XnxxApi from './api/xnxx';
import { toMetaPreview, toMetaDetails, toStreams } from './converter';
import { b64decode } from './helpers';

const xnxx = new XnxxApi();

async function initAddon() {
    const addon = new addonBuilder(await loadManifest());

    addon.defineCatalogHandler(async ({extra, id}) => {
        let metas = [];
        console.log(extra);

        let endpoint;
        if (id == 'categories') {
            const category = (await xnxx.getAllCategories()).find(cat => cat.name == extra.genre);
            endpoint = category.endpoint;
        } else if (id = 'search') {
            endpoint = xnxx.getSearchEndpoint(extra.search);
        } else {
            throw new Error('unexpected category id: ' + id);
        }

        const videos = await xnxx.getVideos(endpoint, extra.skip != null ? Math.floor(extra.skip / xnxx.vidsPerPage) : null);
        // console.log(videos);
        metas = videos.map(vid => toMetaPreview(vid));
        

        return Promise.resolve({metas});
    });

    addon.defineMetaHandler(async ({id}) => {
        const endpoint = b64decode(id.split(':')[1]);
        const videoDetails = await xnxx.getVideoDetails(endpoint);
       // console.log(videoDetails);

        let meta = toMetaDetails(videoDetails);

        return Promise.resolve({meta});
    });

    addon.defineStreamHandler(async ({id}) => {
        const endpoint = b64decode(id.split(':')[1]);
        const videoSources = await xnxx.getVideoSources(endpoint);

        return Promise.resolve({streams: toStreams(videoSources)});
    });

    return addon.getInterface();
}

export default initAddon;
