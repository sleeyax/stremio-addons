export default interface Video {
    // relative URL path to the video
    endpoint: string,
    // thumbnail image URL
    thumbnail: string,
    // similar to a thumbnail, but shows multiple frames of the video in one image
    thumbSlide?: string
    title: string,
    views: string,
    duration: string,
    // rating as a percentage 
    rating: string,
    quality: string
    likes?: number,
    dislikes?: number,
    description?: string,
    tags?: string[]
}