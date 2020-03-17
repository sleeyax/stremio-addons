import { MetaPreview } from "stremio-addon-sdk";

export interface Data extends MetaPreview {
    links?: {name: string, url: string}[]
}

export const communities: Data[] = [
    {
        id: 'help:community:reddit',
        name: 'Reddit',
        type: 'movie',
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
        type: 'movie',
        poster: 'https://i.imgur.com/AzdD4qZ.png',
        posterShape: 'square',
        description: 'Connect with friends, family and other people you know',
        links: [
            {
                name: 'StremioAddons page',
                url: 'https://www.facebook.com/StremioAddons'
            }
        ]
    },
    {
        id: 'help:community:discord',
        name: 'Discord',
        type: 'movie',
        poster: 'https://i.imgur.com/MxEgB2o.jpg',
        posterShape: 'square',
        description: 'It\'s time to ditch Skype and TeamSpeak.All -in -one voice and text chat for gamers that\'s free, secure, and works on both your desktop and phone.Connect with friends, family and other people you know',
        links: [
            {
                name: 'r/stremioaddons discord',
                url: 'https://discord.gg/zNRf6YF'
            }
        ]
    },
];

export const tools: Data[] = [
    {
        id: 'help:tools:pms',
        name: 'PimpMyStremio',
        type: 'movie',
        poster: 'https://raw.githubusercontent.com/sungshon/PimpMyStremio/master/src/web/logo.png',
        posterShape: 'square',
        logo: 'https://avatars0.githubusercontent.com/u/49482512?s=460&v=4',
        description: 'Local add- on manager for Stremio',
        links: [
            {
                name: 'Source code',
                url: 'https://github.com/sungshon/PimpMyStremio',
            },
            {
                name: 'Download',
                url: 'https://github.com/sungshon/PimpMyStremio/releases'
            },
            {
                name: 'Android guide (old)',
                url: 'https://gist.github.com/sleeyax/e9635eb352a4fcdf94194f763d743689'
            }
        ] 
    },
    {
        id: 'help:tools:downloader-pc',
        name: 'Stremio Downloader',
        type: 'movie',
        poster: 'https://raw.githubusercontent.com/BurningSands70/stremio-downloader/master/assets/addonLogo.png',
        posterShape: 'square',
        logo: 'https://avatars0.githubusercontent.com/u/55944558?s=460&v=4',
        description: 'An application that allows downloading streams from Stremio.',
        links: [
            {
                name: 'Source code',
                url: 'https://github.com/BurningSands70/stremio-downloader',
            },
            {
                name: 'Download',
                url: 'https://github.com/BurningSands70/stremio-downloader/releases'
            }
        ]
    },
    {
        id: 'help:tools:p2p',
        name: 'Stremio P2P',
        type: 'movie',
        poster: 'https://raw.githubusercontent.com/ShivamRawat0l/StremioP2P/master/P2PClient/build/icon.ico',
        posterShape: 'square',
        logo: 'https://avatars0.githubusercontent.com/u/27425384?s=400&u=d83889b1e4e0b27672227091b26589393333e5bc&v=4',
        description: 'Stremio Addon for p2p video sharing',
        links: [
            {
                name: 'Source code',
                url: 'https://github.com/ShivamRawat0l/StremioP2P',
            },
            {
                name: 'Demo',
                url: 'https://youtu.be/fFs1MNHoXFw',
            },
            {
                name: 'Install',
                url: 'https://node-server-hogl9g5qa.now.sh/'
            },

        ]
    },
    {
        id: 'help:tools:catalog-builder',
        name: 'Stremio Catalog Builder',
        type: 'movie',
        poster: '',
        posterShape: 'square',
        logo: '',
        description: 'Personalize your Stremio Experience',
        links: [
            {
                name: 'URL',
                url: 'https://stremio.github.io/stremio-catalog-builder/',
            },
            {
                name: 'How to use',
                url: 'https://www.reddit.com/r/StremioAddons/comments/atizrk/news_stremio_catalog_builder/'
            }
        ]
    },
];
