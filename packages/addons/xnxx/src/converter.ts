import Video from "./models/video";
import { MetaPreview, MetaDetail, Stream } from "stremio-addon-sdk";
import { b64encode } from "./helpers";
import VideoSource from "./models/vide_source";

export function toMetaPreview(video: Video) {
    return <MetaPreview>{
        id: `xnxx:${b64encode(video.endpoint)}`,
        name: video.title,
        type: 'movie',
        background: '../assets/background_blue.png',
        description: `${video.duration} ${video.quality} ${video.views} views`,
        logo: '../assets/logo_round.png',
        poster: video.thumbnail,
        posterShape: 'landscape'
    };
}

export function toMetaDetails(video: Video) {
    const metaPreview = toMetaPreview(video);
    return <MetaDetail>{
        ...metaPreview,
        description: video.description || metaPreview.description,
        links: (video.tags || []).map(name => ({
            category: 'genre',
            name,
            url: `xnxx:${b64encode('/search/' + name)}`
        })),
        runtime: video.duration,
        background: video.thumbSlide || video.thumbnail
    };
}

export function toStreams(videoSources: VideoSource) {
    const qualities = videoSources.quailities
        .sort((a, b) => +b.quality.slice(0, -1) - +a.quality.slice(0, -1))
        .map(quality => <Stream>{
            name: 'XNXX',
            title: 'HLS ' + quality.quality,
            url: quality.sourceUrl
        }
    );
    return <Stream[]>[
        {
            name: 'XNXX',
            title: 'HLS Auto',
            url: videoSources.hlsAuto
        },
        ...qualities,
        {
            name: 'XNXX',
            title: 'MP4 high quality',
            url: videoSources.mp4High
        },
        {
            name: 'XNXX',
            title: 'MP4 low quality',
            url: videoSources.mp4Low
        }
    ];
}