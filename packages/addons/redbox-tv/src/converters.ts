import Channel from "./models/channel";
import { MetaPreview, ContentType, Stream } from "stremio-addon-sdk";
import RedBoxStream from "./models/stream";

export function toMetaPreviews(channels: Channel[]) {
    return channels.map(channel => <MetaPreview>{
        id: 'rbtv:' + channel.id,
        type: ContentType.TV,
        name: channel.name,
        poster: channel.iconUrl,
        posterShape: 'square',
        logo: channel.iconUrl
    });
}

export async function toStreams(streams: RedBoxStream[]) {
    return await Promise.all(streams.map(async stream => <Stream>{
        url: await stream.getM3u8Playlist(),
        title: '' + stream.type,
        name: 'RBTV'
    }));
}