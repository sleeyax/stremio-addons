import {Manifest} from 'stremio-addon-sdk';
// require so package.json doens't get copied to build folder
const {version, description} = require('../package.json');

const manifest: Manifest = {
   id: 'com.sleeyax.stream-quality-filter',
   name: 'Stream Quality Filter',
   description,
   logo: 'https://i.imgur.com/iUBNpZM.png',
   catalogs: [],
   resources: ['stream'],
   types: ['movie', 'series'],
   version,
   idPrefixes: ['tt']
};

export default manifest;
