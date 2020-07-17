import manifest from './manifest';
import {addonBuilder, Stream, serveHTTP} from 'stremio-addon-sdk';
import Video from 'stremio-cinemeta-proxy';
import CartoonExtra from './cartoonextra';
import slugify from 'slugify';

const cartoonExtra = new CartoonExtra();

const addon = new addonBuilder(manifest);

addon.defineStreamHandler(async ({id, type}) => {
  let streams = [];

  // get the title of the cartoon by imdbid
  const vid = new Video(id);
  const {name, _, episode} = await vid.getInfo();

  // convert name to slug (this way we don't have to search for the show first, which reduces load on the website)
  let slug = slugify(name.toLowerCase(), {remove: /[*+~.()'"!:@]/g});

  const optionalSeason = episode.season != 1 ? `-season-${episode.season}` : '';
  slug += `${optionalSeason}-episode-${episode.number}`;
 
  try {
    const cartoonStreams = await cartoonExtra.getStreams(slug);

    streams = cartoonStreams.map((url, i) => (<Stream>{
      name: 'Cartoon Extra',
      url,
      title: `${name} ${type == 'series' ? `Season ${episode.season} Episode ${episode.number}\n` : ''}Server ${i + 1}`
    }));
  } catch(err) {
    if (process.env.NODE_ENV != 'production') {
      console.log(`failed to get cartoon with slug: ${slug}`);
      throw err;
    }
  }

  return {streams, cacheMaxAge: process.env.NODE_ENV != 'production' || process.env.NODE_ENV == undefined ? 0 : 3600};
});

export default addon.getInterface();