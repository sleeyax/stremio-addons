export const port = +process.env.PORT || 359;
export const prefix = 'mpl:';
export const streamingServerUrl = process.env.STREAMING_SERVER_URL || 'http://127.0.0.1:11470';
export const addonUrl = process.env.ADDON_URL || 'http://127.0.0.1:' + port;
