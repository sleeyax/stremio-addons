import { infoHashLongRegex, infoHashRegex, magnetRegex, mediaFileRegex, remoteTorrentRegex, ttidRegex } from './constants';
import { remote as fetchRemoteTorrent, Instance as ParseTorrentInstance} from 'parse-torrent';

export function parseRemoteTorrent(torrentId: string): Promise<ParseTorrentInstance> {
  return new Promise((resolve, reject) => {
    fetchRemoteTorrent(torrentId, (err, parsedTorrent) => {
      if (err) reject(err);
      else resolve(parsedTorrent);
    })
  });
}

export const isTorrent       = (value: string) => magnetRegex.test(value) || (infoHashLongRegex.test(value) || infoHashRegex.test(value));
export const isMediaFile     = (value: string) => mediaFileRegex.test(value);
export const isImdbId        = (value: string) => ttidRegex.test(value);
export const isRemoteTorrent = (value: string) => remoteTorrentRegex.test(value);
