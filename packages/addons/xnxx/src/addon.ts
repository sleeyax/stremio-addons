import {addonBuilder} from 'stremio-addon-sdk';
import loadManifest from './manifest';
import XnxxApi from './api/xnxx';
import { toMetaPreview } from './converter';

const xnxx = new XnxxApi();

async function initAddon() {
    const addon = new addonBuilder(await loadManifest());

    addon.defineCatalogHandler(async ({extra, id}) => {
        let metas = [];

        if (id == 'categories') {
            const category = (await xnxx.getAllCategories()).find(cat => cat.name == extra.genre);
            const videos = await xnxx.getVideos(category.endpoint);
            console.log(videos);
            metas = videos.map(vid => toMetaPreview(vid));
        }

        return Promise.resolve({metas});
    });

    addon.defineMetaHandler((args) => {
        return Promise.resolve({meta: null});
    });

    addon.defineStreamHandler((args) => {
        return Promise.resolve({streams: []});
    });

    return addon.getInterface();
}

export default initAddon;
