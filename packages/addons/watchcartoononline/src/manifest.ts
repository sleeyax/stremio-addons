import { Manifest } from "stremio-addon-sdk";

const {version, description} = require('../package.json');

export default <Manifest>{
  id: 'com.sleeyax.wco',
  name: 'Watch Cartoon Online',
  version,
  description,
  logo: 'https://www.wcofun.com/logo.gif',
  background: 'https://i.imgur.com/ERLkgpY.png',
  types: ['series'],
  resources: ['stream'],
  catalogs: [],
  idPrefixes: ['tt']
};
