import { Manifest } from 'stremio-addon-sdk';
import { prefix } from './constants';
const {version, description} = require('../package.json');

export default {
  id: 'com.sleeyax.searchandplay',
  version,
  description,
  name: 'Search and Play',
  logo: 'https://i.imgur.com/Y2plbJv.png',
  resources: ['catalog', 'meta'],
  catalogs: [{
    id: 'sap-search',
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
