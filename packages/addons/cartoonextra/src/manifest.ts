import { Manifest } from "stremio-addon-sdk";

const {version, description} = require('../package.json');

export default <Manifest>{
  id: 'com.sleeyax.cartoonextra',
  name: 'Cartoon Extra',
  version,
  description,
  logo: 'https://i.imgur.com/aSI1e79.png',
  types: ['series'],
  resources: ['stream'],
  catalogs: [],
  idPrefixes: ['tt']
};
