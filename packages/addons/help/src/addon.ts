import { addonBuilder, MetaPreview, Stream } from "stremio-addon-sdk";
import manifest from './manifest';
import communities, { Community } from "./data/communities";

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(({id}) => {
    let metas: MetaPreview[] = [];

    if (id.startsWith('communities'))
        metas = communities;
        
    return Promise.resolve({metas});
});

builder.defineStreamHandler(({id}) => {
    let streams: Stream[] = [];

    const type = id.split(':')[1];
    
    if (type == 'community') {
        const selectedCommunity: Community = communities.find(com => com.id == id);
        streams = selectedCommunity.links.map(link => (<Stream>{
            name: 'help',
            title: link.name,
            externalUrl: link.url
        }));
    }

    return Promise.resolve({streams});
});

export default builder.getInterface();