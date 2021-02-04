import { Manifest } from 'stremio-addon-sdk';
import { prefix } from './constants';
const {version, description} = require('../package.json');

export default {
  id: 'com.sleeyax.magnetplayer',
  version,
  description,
  name: 'Play URL/Magnet link',
  logo: 'https://i.imgur.com/1aFTsca.png',
  resources: ['catalog', 'meta'],
  catalogs: [{
    id: 'mpl-search',
    name: 'Search Results',
    type: 'channel',
    extra: [{
      name: 'search',
      isRequired: true,
    }]
  }],
  types: ['channel', 'movie', 'series', 'tv', 'other'],
  idPrefixes: [prefix]
} as Manifest;
