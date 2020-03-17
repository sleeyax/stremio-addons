import Channel from "./models/channel";
import { MetaPreview, Stream } from "stremio-addon-sdk";
import RedBoxStream from "./models/stream";

const http2https = (url) => 'https://http2https.sleeyax.now.sh/' + Buffer.from(url).toString('base64');

export function toMetaPreviews(channels: Channel[]) {
    return channels.map(channel => <MetaPreview>{
        id: 'rbtv:' + channel.id,
        type: 'tv',
        name: channel.name,
        poster: http2https(channel.iconUrl),
        posterShape: 'square',
        logo: channel.iconUrl
    });
}

export async function toStreams(streams: RedBoxStream[]) {
    return await Promise.all(streams.map(async stream => <Stream>{
        url: await stream.getM3u8Playlist(),
        title: 'stream ' + stream.type,
        name: 'RBTV'
    }));
}