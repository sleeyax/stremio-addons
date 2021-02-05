import {decode as decodeMagnet} from 'magnet-uri';
import { infoHashLongRegex, infoHashRegex, magnetRegex, mediaFileRegex } from './constants';

export function parseTorrent (value: string) {
  // full magnet uri
  if (magnetRegex.test(value))
    return decodeMagnet(value);
  // info hash only (hex string)
  else if ((infoHashLongRegex.test(value) || infoHashRegex.test(value)))
    return decodeMagnet(`magnet:?xt=urn:btih:${value}`);
  else
    return null;
}

export const isTorrent = (value: string) => magnetRegex.test(value) || (infoHashLongRegex.test(value) || infoHashRegex.test(value));
export const isMediaFile = (value: string) => mediaFileRegex.test(value);
