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
  // example slug format: spongebob-squarepants-season-12-episode-25-escape-from-beneath-glove-world
  const slug = slugify(`${name} season ${episode.season} episode ${episode.number} ${episode.name}`, {
    remove: /[*+~.()'"!–/:@]/g,
    lower: true
  });

  try {
    const video = await wco.getVideo(slug);
    streams.push(
      <Stream>{
        name: 'WCO',
        url: video.HD,
        title: `${name} Season ${episode.season} Episode ${episode.number}\nQuality: HD`
      },
      <Stream>{
        name: 'WCO',
        url: video.SD,
        title: `${name} Season ${episode.season} Episode ${episode.number}\nQuality: SD`
      },
    );
  } catch (err) {
    if (process.env.NODE_ENV != 'production') {
      console.log(`failed to get cartoon with slug: ${slug}`);
      throw err;
    }
  }

  return { streams, cacheMaxAge: process.env.NODE_ENV != 'production' || process.env.NODE_ENV == undefined ? 0 : 3600 };
});

export default addon.getInterface();