import { Manifest } from "stremio-addon-sdk";
const {version} = require('../package.json');

export default <Manifest> {
    id: 'com.sleeyax.netflix-for-free-aprilfools-2020',
    name: 'NETFLIX FOR FREE',
    description: 'Watch movies and series from NETFLIX, all for free and no account required!',
    catalogs: [],
    resources: ['stream'],
    types: ['movie', 'series'],
    version,
    background: 'https://assets.nflxext.com/ffe/siteui/vlv3/3b48f428-24ed-4692-bb04-bc7771854131/044ccce4-e8eb-480f-b532-2074bcd827ab/BE-en-20200302-popsignuptwoweeks-perspective_alpha_website_small.jpg',
    logo: 'https://image.flaticon.com/icons/png/512/870/870910.png',
    idPrefixes: ['tt']
};