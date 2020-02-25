import { addonBuilder, MetaPreview } from "stremio-addon-sdk";
import manifest from "./manifest";
import RedboxTvApiWrapper from "./api";
import { toMetaPreviews, toStreams } from "./converters";
const api = new RedboxTvApiWrapper();

async function addonInit() {
    const redbox = await api.getBox();

    // populate 'extra.options' in manifest
    manifest.catalogs[0].extra
        .find(extra => extra.name == 'genre')
            .options = redbox.categories.map(cat => cat.name);

    const builder = new addonBuilder(manifest);

    builder.defineCatalogHandler(({ extra, id }) => {
        let metas: MetaPreview[] = [];

        if (extra.search && id == 'redboxtv-search') {
            const channels = redbox.channels.filter(channel => channel.name.toLowerCase().indexOf(extra.search.toLowerCase()) > -1);
            metas = toMetaPreviews(channels);
        } else {
            // filter channels based on selected genre
            const channels = redbox.channels.filter(channel => channel.category.name == extra.genre);

            let skip = 0;
            let max = 50;
            let channelsCount = channels.length;
            
            if (extra.skip) {
                skip = extra.skip || 0;
                max = (channelsCount - skip >= max) ? skip + max : channelsCount - (channelsCount - skip)
            } else {
                if (channelsCount < max) max = channelsCount;
            }

            metas = toMetaPreviews(channels.slice(skip, max));
        }

        return Promise.resolve({ metas, cacheMaxAge: 3600 * 24 * 7 });
    });

    builder.defineStreamHandler(async ({id}) => {
        let streams = [];

        const selectedChannel = redbox.channels.find(chan => chan.id == Number.parseInt(id.split(':')[1]));
        
        if (selectedChannel)
            streams = await toStreams(selectedChannel.streams);

        return Promise.resolve({streams});
    });

    return builder.getInterface();
}

export default addonInit;
