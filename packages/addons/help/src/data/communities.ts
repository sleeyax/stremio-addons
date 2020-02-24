import { MetaPreview, ContentType } from "stremio-addon-sdk";

export interface Community extends MetaPreview {
    links?: {name: string, url: string}[]
}

const communities: Community[] = [
    {
        id: 'help:community:reddit',
        name: 'Reddit',
        type: ContentType.MOVIE,
        poster: 'https://i.imgur.com/ec7o6Hu.png',
        posterShape: 'square',
        description: 'Reddit is a network of communities based on people\'s interest',
        links: [
            {
                name: 'r/stremio',
                url: 'https://www.reddit.com/r/Stremio',
            },
            {
                name: 'r/stremioaddons',
                url: 'https://www.reddit.com/r/StremioAddons'
            }
        ]
    },
    {
        id: 'help:community:facebook',
        name: 'Facebook',
        type: ContentType.MOVIE,
        poster: 'https://i.imgur.com/AzdD4qZ.png',
        posterShape: 'square',
        description: 'Connect with friends, family and other people you know',
        links: [
            {
                name: 'StremioAddons page',
                url: 'https://www.facebook.com/StremioAddons'
            }
        ]
    }
];

export default communities;