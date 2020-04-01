import addonInterface from './addon';
import { serveHTTP } from 'stremio-addon-sdk';

serveHTTP(addonInterface, {port: +process.env.PORT || +process.argv[2] || 1001});
