import manifest from './manifest';
import {addonBuilder, Stream} from 'stremio-addon-sdk';
import Video from 'stremio-cinemeta-proxy';
import CartoonExtra from './cartoonextra';

const cartoonExtra = new CartoonExtra();

const addon = new addonBuilder(manifest);

addon.defineStreamHandler(async ({id, type}) => {
  let streams = [];

  // get the title of the cartoon by imdbid
  const vid = new Video(id);
  const {name, _, episode} = await vid.getInfo();

  // search show and get streams
  const shows = await cartoonExtra.search(name);
  const show = shows.find((show) => show.title == name);

  if (show != undefined) {
    let slug = show.getSlug();

    if (type == 'series') {
      const optionalSeason = episode.season != undefined && episode.season != 1 ? `-season-${episode.season}` : '';
      slug += `${optionalSeason}-episode-${episode.number}`;
    }
   
    const cartoonStreams = await cartoonExtra.getStreams(slug);

    streams = cartoonStreams.map((url, i) => (<Stream>{
      name: 'Cartoon Extra',
      url,
      title: `${show.title} ${type == 'series' ? `Season ${episode.season} Episode ${episode.number}\n` : ''}Server ${i + 1}`
    }));
  }

  return Promise.resolve({streams});
});

export default addon.getInterface();