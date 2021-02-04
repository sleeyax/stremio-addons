import { Manifest } from 'stremio-addon-sdk';
import { prefix } from './constants';
const {version, description} = require('../package.json');

export default {
  id: 'com.sleeyax.magnetplayer',
  version,
  description,
  name: 'Play URL/Magnet link',
  logo: 'https://i.imgur.com/Zxpf2bR.png',
  resources: ['catalog', 'meta'],
  catalogs: [{
    id: prefix + 'search',
    name: 'Search Results',
    type: 'channel',
    extra: [{
      name: 'search',
      isRequired: true
    }]
  }],
  types: ['channel'],
  idPrefixes: [prefix]
} as Manifest;
