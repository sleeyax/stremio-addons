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
        
        if (id == 'categories') {
            const category = (await xnxx.getAllCategories()).find(cat => cat.name == extra.genre);
            const videos = await xnxx.getVideos(category.endpoint, extra.skip != null ? Math.floor(extra.skip / xnxx.vidsPerPage) : null);
            // console.log(videos);
            metas = videos.map(vid => toMetaPreview(vid));
        }
        else if (id == 'search') {
            metas = (await xnxx.searchVideos(extra.search)).map(vid => toMetaPreview(vid));
        }

        return Promise.resolve({metas, cacheMaxAge: 24 * 3600});
    });

    addon.defineMetaHandler(async ({id}) => {
        const endpoint = b64decode(id.split(':')[1]);
        const videoDetails = await xnxx.getVideoDetails(endpoint);

        let meta = toMetaDetails(videoDetails);

        return Promise.resolve({meta, cacheMaxAge: 24 * 3600 * 3});
    });

    addon.defineStreamHandler(async ({id}) => {
        const endpoint = b64decode(id.split(':')[1]);
        const videoSources = await xnxx.getVideoSources(endpoint);
        
        const streams = toStreams(videoSources);
        
        // streams will not be cached if the result is only low quality + link to website
        return Promise.resolve({streams, cacheMaxAge: 24 * 3600 * (streams.length > 2 ? 7 : 0)});
    });

    return addon.getInterface();
}

export default initAddon;
