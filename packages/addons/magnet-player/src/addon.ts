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
  
  // torrent
  if (infoHash) {    
    const engine = await createEngine(infoHash, announce);
    
    return {metas: [{
      id: prefix + engine.infoHash,
      name: engine.name,
      type: 'channel',
      poster: manifest.logo,
      logo: manifest.logo,
    }], cacheMaxAge};
  } 
  // regular media file
  else if (/.mkv$|.avi$|.mp4$|.wmv$|.vp8$|.mov$|.mpg$|.mp3$|.flac$/i.test(extra.search)) {
    return {metas: [{
      id: prefix + extra.search,
      name: extra.search.split('/').pop(),
      type: 'channel',
      poster: manifest.logo,
      logo: manifest.logo,
    }], cacheMaxAge};
  } else {
    return {metas: [], cacheMaxAge};
  }
});

addon.defineMetaHandler(async ({id}) => {
  const infoHash = id.split(prefix).pop();

  // if it's not an infohash but a remote media file
  if (infoHash.startsWith('https://') || infoHash.startsWith('http://')) {
    const name = infoHash.split('/').pop();
    const description = 'Play remote media file';
    return {meta: {
      id, 
      name,
      type: 'channel',
      description,
      logo: manifest.logo,
      poster: manifest.logo,
      website: infoHash,
      videos: [
        {
          id,
          title: name,
          released: new Date().toISOString(),
          description,
          // NOTE: 'streams' array doesn't seem to work (at least on android), but single stream property does
          stream: {
            url: infoHash,
          }
        }
      ]
    }, cacheMaxAge};
  }

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
