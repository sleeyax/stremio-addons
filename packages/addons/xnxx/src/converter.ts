import Video from "./api/video";
import { MetaPreview } from "stremio-addon-sdk";
import { b64encode } from "./helpers";

export function toMetaPreview(video: Video) {
    return <MetaPreview>{
        id: `xnxx:${b64encode(video.endpoint)}`,
        name: video.title,
        type: 'movie',
        background: '../assets/background_blue.png',
        description: `${video.duration} ${video.quality} ${video.views}`,
        logo: '../assets/logo_round.png',
        poster: video.thumbnail,
        posterShape: 'landscape'
    };
}