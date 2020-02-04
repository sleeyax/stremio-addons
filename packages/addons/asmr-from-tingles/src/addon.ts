import { addonBuilder, Stream, AddonInterface, MetaPreview, MetaDetail, ContentType } from 'stremio-addon-sdk';
import createManifest from './manifest';
import TinglesApi from './tingles-api';
import IVideo from './models/video';
const tingles = new TinglesApi();

/**
 * Convert video from the tingles API to MetaPreview object
 * @param video 
 */
function videoToMetaPreview(video: IVideo): MetaPreview {
    return <MetaPreview>{
        id: 'tingles:' + video.uuid,
        name: video.title,
        type: ContentType.MOVIE,
        description: video.description.split('\n')[0],
        poster: video.thumbnailURL,
        posterShape: 'landscape',
        background: video.thumbnailURL
    };
}

export default async function (): Promise<AddonInterface> {
    const triggers = await tingles.getTriggers();

    const genres = triggers.map(trigger => trigger.title);
    const builder = new addonBuilder(createManifest(genres));

    builder.defineCatalogHandler(async ({ extra }) => {
        let metas = [];

        if (extra.genre) {
            const selectedTrigger = triggers.find(trigger => trigger.title == extra.genre);
            if (selectedTrigger != null) {
                const videos = await tingles.getVideos(selectedTrigger.uuid);
                metas = videos.map(video => videoToMetaPreview(video));
            }
        }

        if (extra.search) {
            const searchResults = await tingles.search(extra.search);
            metas = searchResults.videos.map(video => videoToMetaPreview(video));
        }

        return Promise.resolve({ metas });
    });

    builder.defineMetaHandler(async ({ id }) => {
        // get video uuid from id (format is tingles:<uuid>)
        const uuid = id.split(':')[1];

        const video = await tingles.getVideoInfo(uuid);
        const artist = await tingles.getArtistInfo(video.artistUuid);

        // 'convert' metapreview to metadetail
        const meta = videoToMetaPreview(video) as MetaDetail;
        meta.runtime = '~' + Math.round(video.duration / 60) + 'm';
        meta.country = artist.country;
        meta.logo = artist.profileImageBigURL;
        meta.links = [
           {
               category: 'director',
               name: artist.name,
               url: artist.shareURL
           } 
        ];
        meta.director = [artist.name];
        meta.website = artist.patreonURL || artist.payPalURL;
        meta.released = new Date(video.publishedAt).toString();
        meta.awards = video.isExclusive ? 'Exclusive' : '';

        return Promise.resolve({ meta });
    });

    builder.defineStreamHandler(async ({id}) => {
        const uuid = id.split(':')[1];

        const streamsFromAPI = await tingles.getStreams(uuid);
        
        const streams: Stream[] = Object.keys(streamsFromAPI).map(name => (<Stream>{
            name: 'Tingles',
            title: name,
            url: streamsFromAPI[name]
        }));
        streams.push({
            name: 'Tingles',
            title: 'youtube',
            ytId: uuid,
        });
        streams.push({
            name: 'Tingles',
            title: 'youtube (external)',
            externalUrl: 'https://www.youtube.com/watch?v=' + uuid,
        });

        return Promise.resolve({ streams });
    });

    return builder.getInterface();
};