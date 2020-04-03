
export default interface VideoSource {
    mp4High: string,
    mp4Low: string,
    hlsAuto: string, 
    quailities: VideoQuality[]
}

type quality = '1080p' | '720p' | '480p' | '360p' | '250p';

export interface VideoQuality {
    quality: quality,
    sourceUrl: string
}