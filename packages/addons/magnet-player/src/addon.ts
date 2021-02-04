import {config as configEnv} from 'dotenv';
configEnv();
import { addonBuilder, MetaDetail } from 'stremio-addon-sdk';
import { decode as decodeMagnet } from 'magnet-uri';
import manifest from './manifest';
import createEngine, { fetchMeta } from './engine';
import { prefix } from './constants';

const cacheMaxAge = process.env.NODE_ENV === 'development' ? 0 : (24 * 3600 * 7);

const addon = new addonBuilder(manifest);

addon.defineCatalogHandler(async ({extra}) => {
  // http://127.0.0.1:359/catalog/channel/mp%3Asearch/search=magnet%3A%3Fxt%3Durn%3Abtih%3A69D6E9DB67D79BCA872B5C02141BDA56C42DE5B7%26dn%3DThe%2BWild%2BPacific%2B%25282016%2529%2B720p%2E10bit%2EBluRay%2Ex265%2Dbudgetbits%26tr%3Dudp%253A%252F%252Ftracker%2Ezer0day%2Eto%253A1337%252Fannounce%26tr%3Dudp%253A%252F%252Ftracker%2Ezer0day%2Eto%253A1337%252Fannounce%26tr%3Dudp%253A%252F%252Ftracker%2Eleechers%2Dparadise%2Eorg%253A6969%252Fannounce%26tr%3Dudp%253A%252F%252Fcoppersurfer%2Etk%253A6969%252Fannounce.json
  const {infoHash, announce} = decodeMagnet(extra.search);
  if (!infoHash) return {metas: [], cacheMaxAge};
  const engine = await createEngine(infoHash, announce);
  return {metas: [{
    id: prefix + engine.infoHash,
    name: engine.name,
    type: 'channel',
  }], cacheMaxAge};
});

addon.defineMetaHandler(async ({id}) => {
  // http://127.0.0.1:359/meta/channel/bt%3A69d6e9db67d79bca872b5c02141bda56c42de5b7.json
  const infoHash = id.split(':')[1];
  const metaResponse = await fetchMeta(infoHash);
  return {meta: {
    ...metaResponse.meta,
    id,
  }, cacheMaxAge};
});

export default addon.getInterface();
