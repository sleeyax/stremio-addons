export default interface Video {
    // unique identifier, represented as a long number
    id: string,
    endpoint: string,
    // thumbnail image URL
    thumbnail: string,
    title: string,
    views: string,
    duration: string,
    // average watchtime as a percentage 
    watchTime: string,
    quality: string
}