// list of addons that support Quick Search
const supportedAddons: SupportedAddon[] = [
    {
        name: 'local',
        url: 'http://127.0.0.1:39730'
    },
    {
        name: '1337x',
        url: 'https://stremio-1337x-addon.sleeyax.now.sh'
    },
    {
        name: 'rarbg',
        url: 'https://stremio-rarbg-addon-dev.sleeyax.now.sh'
    }
];

export interface SupportedAddon {
    name: string
    url: string,
    extras?: {} // TODO: specify extras format
}

export default supportedAddons;