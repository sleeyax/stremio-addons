export default interface IVideo {
    ageRestricted: boolean;
    artistUuid: string;
    description: string;
    duration: number;
    isExclusive: boolean;
    legacyKey: string;
    publishedAt: number;
    tags: any[],
    thumbnailURL: string;
    title: string;
    uuid: string;
    youTubeViewCount: number;
}