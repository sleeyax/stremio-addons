import {config as configEnv} from 'dotenv';
configEnv();
import { addonBuilder } from 'stremio-addon-sdk';
import { decode as decodeMagnet } from 'magnet-uri';
import manifest from './manifest';
import createEngine, { fetchMeta } from './engine';
import { addonUrl, prefix, streamingServerUrl } from './constants';

const cacheMaxAge = process.env.NODE_ENV === 'development' ? 0 : (24 * 3600 * 7);

const addon = new addonBuilder(manifest);

addon.defineCatalogHandler(async ({extra}) => {
  if (!extra.search) return {metas: [], cacheMaxAge};

  const {infoHash, announce} = decodeMagnet(extra.search);
  
  if (!infoHash) return {metas: [], cacheMaxAge};
  
  const engine = await createEngine(infoHash, announce);
  
  return {metas: [{
    id: prefix + engine.infoHash,
    name: engine.name,
    type: 'channel',
    poster: manifest.logo,
    logo: manifest.logo,
  }], cacheMaxAge};
});

addon.defineMetaHandler(async ({id}) => {
  const infoHash = id.split(':')[1];
  const metaResponse = await fetchMeta(infoHash);

  const meta = metaResponse.meta;
  meta.id = id;
  meta.videos = meta.videos?.map(video => {
    video.thumbnail = video.thumbnail?.replace(streamingServerUrl, addonUrl);
    return video;
  });
  meta.background = meta.background?.replace(streamingServerUrl, addonUrl);
  
  return {meta, cacheMaxAge};
});

export default addon.getInterface();
