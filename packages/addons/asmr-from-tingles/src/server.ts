import addonInit from './addon';
import { serveHTTP } from 'stremio-addon-sdk';

addonInit().then(addonInterface => serveHTTP(addonInterface, {port: 7000}));
