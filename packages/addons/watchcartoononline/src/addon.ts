import manifest from './manifest';
import { addonBuilder, Stream, serveHTTP } from 'stremio-addon-sdk';
import Video from 'stremio-cinemeta-proxy';
import slugify from 'slugify';
import WatchCartoonOnline from './watchcartoononline';

const wco = new WatchCartoonOnline();

const addon = new addonBuilder(manifest);

addon.defineStreamHandler(async ({ id, type }) => {
  let streams = [];

  // get the title of the cartoon by imdbid
  const vid = new Video(id);
  const { name, _, episode } = await vid.getInfo();

  // convert name to slug (this way we don't have to search for the show first, which reduces load on the website)
  // NOTE: this doesn't work well for shows like spongebob that have multiple videos in one episode for some reason. 
  const slug = slugify(`${name} season ${episode.season} episode ${episode.number}`, {
    remove: /[*+~.()'"!–/:@]/g,
    lower: true
  });

  try {
    const videos = await wco.getVideos(slug);
    for (const video of videos) {
      for (const source of video.sources) {
        streams.push(<Stream>{
          name: 'WCO',
          url: source.url,
          title: `${video.fileName}\n${source.quality} HTTP stream`
        });
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV != 'production') {
      console.log(`failed to get cartoon with slug: ${slug}`);
      throw err;
    }
  }

  return { streams, cacheMaxAge: process.env.NODE_ENV != 'production' || process.env.NODE_ENV == undefined ? 0 : 3600 * 24 };
});

export default addon.getInterface();