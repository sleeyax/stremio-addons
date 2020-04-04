
export default interface VideoSource {
    // link to the original video
    externalUrl: string,
    mp4High: string,
    mp4Low: string,
    hlsAuto: string, 
    qualities?: VideoQuality[]
}

type quality = '1080p' | '720p' | '480p' | '360p' | '250p';

export interface VideoQuality {
    quality: quality,
    sourceUrl: string
}