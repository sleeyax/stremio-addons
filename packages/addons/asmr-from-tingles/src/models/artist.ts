export default interface IArtist {
    about: string;
    country: string;
    featuredBanner?: string;
    isFeatured: boolean;
    isPartner:  boolean;
    legacyKey: string;
    name: string;
    patreonURL?: string;
    payPalURL?: string;
    profileImageBigURL: string;
    profileImageURL: string;
    shareURL: string;
    supporterNote: string;
    uuid: string;
    youTubePlaylistId: string;
    youTubeSubscribers: number;
}