import {config as configEnv} from 'dotenv';
configEnv();
import { addonBuilder } from 'stremio-addon-sdk';
import manifest from './manifest';
import createEngine, { fetchMeta } from './engine';
import { addonUrl, prefix, streamingServerUrl } from './constants';
import { isImdbId, isMediaFile, isRemoteTorrent, isTorrent, parseRemoteTorrent } from './converters';
import parseTorrent from 'parse-torrent';
import imdbToMeta from './imdb';

const cacheMaxAge = process.env.NODE_ENV === 'development' ? 0 : (24 * 3600 * 7);

const addon = new addonBuilder(manifest);

addon.defineCatalogHandler(async ({extra}) => {
  if (!extra.search) return {metas: [], cacheMaxAge};

  let searchValue = extra.search;

  if (isTorrent(searchValue) || isRemoteTorrent(searchValue)) {
    const {infoHash, announce} = isRemoteTorrent(searchValue) ? (await parseRemoteTorrent(searchValue)) : parseTorrent(searchValue);

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
  }
  else if (isMediaFile(searchValue)) {
    return {metas: [{
      id: prefix + searchValue,
      name: searchValue.split('/').pop(),
      type: 'channel',
      poster: manifest.logo,
      logo: manifest.logo,
    }], cacheMaxAge};
  }
  else if (isImdbId(searchValue)) {
    const meta = await imdbToMeta(searchValue);
    return {metas: meta != null ? [meta] : [], cacheMaxAge};
  }

  return {metas: [], cacheMaxAge};
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
  meta.videos = (meta.videos || []).map(video => {
    if (video.thumbnail)
      video.thumbnail = video.thumbnail.replace(streamingServerUrl, addonUrl);
    return video;
  });
  if (meta.background)
    meta.background = meta.background.replace(streamingServerUrl, addonUrl);
  
  return {meta, cacheMaxAge};
});

export default addon.getInterface();
