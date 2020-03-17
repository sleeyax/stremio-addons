import {addonBuilder, MetaPreview, MetaDetail} from 'stremio-addon-sdk';
import manifest from './manifest';
import Command from './command';

const addon = new addonBuilder(manifest);

addon.defineCatalogHandler(async ({extra}) => {
    // TODO: remove test data
    let metas: MetaDetail[] = [{
       // id: 'abc',
        name: 'test',
        type: 'channel',
        // @ts-ignore
        video_id: 'dlive_user:roxieph|Roxieph',
        behaviourHints: {
            defaultVideo: "tt0108778:1:1"
        }
    }];

    if (extra.search.startsWith(Command.PREFIX)) {
        const command = new Command(extra.search);
        const results = await command.execute();
        console.log(results);
        // metas = results.map(result => result.)
    }
    
    return Promise.resolve({metas});
});

export default addon.getInterface();
