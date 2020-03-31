import addonInit from './addon';
import { serveHTTP } from 'stremio-addon-sdk';

addonInit().then(addonInterface => serveHTTP(addonInterface, {port: +process.env.PORT || +process.argv[2] || 7000}));
