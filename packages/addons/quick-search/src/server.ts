import addonInterface from './addon';
import { serveHTTP } from 'stremio-addon-sdk';

serveHTTP(addonInterface, {port: 7777});
