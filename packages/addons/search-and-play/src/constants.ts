export const port = +process.env.PORT || 359;
export const prefix = 'sap:';
export const streamingServerUrl = process.env.STREAMING_SERVER_URL || 'http://127.0.0.1:11470';
export const addonUrl = process.env.ADDON_URL || 'http://127.0.0.1:' + port;

export const magnetRegex = /^(stream-)?magnet:/;
export const infoHashLongRegex = /^[a-f0-9]{40}$/i;
export const infoHashRegex = /^[a-z2-7]{32}$/i;
export const mediaFileRegex = /.mkv$|.avi$|.mp4$|.wmv$|.vp8$|.mov$|.mpg$|.mp3$|.flac$/i;
export const ttidRegex = /^(tt)?(\d{7,})$/;
export const remoteTorrentRegex = /\.torrent$/;
