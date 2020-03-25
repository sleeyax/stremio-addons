import addonInterface from './addon';
import { serveHTTP } from 'stremio-addon-sdk';

serveHTTP(addonInterface, { port: +process.argv[2] || 7000 })
