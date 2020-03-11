import initAddon from './addon';
import { getRouter } from 'stremio-addon-sdk';

export default initAddon().then(addonInterface => getRouter(addonInterface));
