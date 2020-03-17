import { addonBuilder, Stream, AddonInterface, MetaDetail, MetaVideo } from 'stremio-addon-sdk';
import createManifest from './manifest';
import TinglesApi from './tingles-api';
import IVideo from './models/video';
import IArtist from './models/artist';
const tingles = new TinglesApi();

/**
 * Convert video from the tingles API to MetaDetail object
 * @param video 
 */
function videoToMetaDetail(video: IVideo): MetaDetail {
    return <MetaDetail>{
        id: 'tingles:' + video.uuid,
        name: video.title,
        type: 'movie',
        description: video.description.split('\n')[0],
        poster: video.thumbnailURL,
        posterShape: 'landscape',
        background: video.thumbnailURL,
        runtime: '~' + Math.round(video.duration / 60) + 'm',
        released: new Date(video.publishedAt).toString(),
        releaseInfo: new Date(video.publishedAt).getFullYear().toString(),
        awards: video.isExclusive ? 'Exclusive' : ''
    };
}

/**
 * Convert artist from tingles API to MetaDetail object
 * @param artist 
 */
function artistToMetaDetail(artist: IArtist): MetaDetail {
    return <MetaDetail>{
        id: 'tingles:' + artist.uuid,
        name: artist.name,
        type: 'channel',
        description: artist.about,
        poster: artist.profileImageURL,
        posterShape: 'square',
        country: artist.country,
        logo: artist.profileImageBigURL,
        links: [
            {
                category: 'director',
                name: artist.name,
                url: artist.shareURL
            }
        ],
        director: [artist.name],
        background: artist.featuredBanner,
    };
}

export default async function (): Promise<AddonInterface> {
    const triggers = await tingles.getTriggers();

    const genres = triggers.map(trigger => trigger.title);
    const builder = new addonBuilder(createManifest(genres));

    builder.defineCatalogHandler(async ({ extra, id }) => {
        let metas = [];

        if (extra.genre) {
            const selectedTrigger = triggers.find(trigger => trigger.title == extra.genre);
            if (selectedTrigger != null) {
                const videos = await tingles.getVideos(selectedTrigger.uuid);
                metas = videos.map(video => videoToMetaDetail(video));
            }
        }
        else if (extra.search) {
            const searchResults = await tingles.search(extra.search);
            if (id == 'tingles-triggers-catalog') {
                metas = searchResults.videos.map(video => videoToMetaDetail(video));
            }
            else if (id == 'tingles-artists-catalog') {
                metas = searchResults.artists.map(artist => artistToMetaDetail(artist));
            }
        }
        // default catalog - show 'best of the week' videos
        else {
            const videos = await tingles.getBestOfTheWeek();
            metas = videos.map(video => videoToMetaDetail(video));
        }

        return Promise.resolve({ metas, cacheMaxAge: 3600 * 24 * 1 });
    });

    builder.defineMetaHandler(async ({ id, type }) => {
        // get video or artist uuid from id (format is tingles:<uuid>)
        const uuid = id.split(':')[1];

        let meta: MetaDetail;
        // single video selected from 'tingles-triggers-catalog' catalog
        if (type == 'movie') {
            const video = await tingles.getVideoInfo(uuid);
            const artist = await tingles.getArtistInfo(video.artistUuid);

            // combine meta info of both artist and video
            // but make sure the video id is correct, so vid comes last to overwrite the artist props
            meta = { ...artistToMetaDetail(artist), ...videoToMetaDetail(video) };
        }
        // ASMR artist channel selected from 'tingles-artists-catalog' catalog
        else if (type == 'channel') {
            const artist = await tingles.getArtistInfo(uuid);
            const videos = await tingles.getArtistVideos(uuid);

            meta = artistToMetaDetail(artist);
            meta.videos = videos.map(video => (<MetaVideo>{
                id: 'tingles:' + video.uuid,
                released: new Date(video.publishedAt).toString(),
                title: video.title,
                available: true,
                thumbnail: video.thumbnailURL
            }));
        } else {
            throw 'Unexpected content type ' + type;
        }

        return Promise.resolve({ meta, cacheMaxAge: 3600 * 24 });
    });

    builder.defineStreamHandler(async ({ id }) => {
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

        return Promise.resolve({ streams, cacheMaxAge: 3600 * 24 * 7 });
    });

    return builder.getInterface();
};