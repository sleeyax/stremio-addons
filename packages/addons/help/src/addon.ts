import { addonBuilder, MetaPreview, Stream } from "stremio-addon-sdk";
import manifest from './manifest';
import { Data, communities, tools } from "./data";

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(({id}) => {
    let metas: MetaPreview[] = [];

    if (id.startsWith('communities')) {
        metas = communities;
    } else if (id.startsWith('tools')) {
        metas = tools;
    }
        
    return Promise.resolve({metas});
});

builder.defineStreamHandler(({id}) => {
    let streams: Stream[] = [];

    const type = id.split(':')[1];

    let data: Data;
    
    if (type == 'community') {
        data = communities.find(com => com.id == id);
    } else if (type == 'tools') {
        data = tools.find(tool => tool.id == id);
    }
    
    if (data)
        streams = data.links.map(link => (<Stream>{
            name: 'help',
            title: link.name,
            externalUrl: link.url
        }));

    return Promise.resolve({streams});
});

export default builder.getInterface();