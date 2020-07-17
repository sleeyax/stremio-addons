import adddonInterface from './addon';
import { serveHTTP } from 'stremio-addon-sdk';

serveHTTP(adddonInterface, {port: +process.env.PORT || +process.argv[2] || 357});