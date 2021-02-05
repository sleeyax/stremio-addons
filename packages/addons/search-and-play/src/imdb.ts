import phin from 'phin';
import cheerio from 'cheerio';
import { MetaPreview } from 'stremio-addon-sdk';

export default async function imdbToMeta(ttid: string): Promise<MetaPreview> {
  try {
    const response = await phin(`https://www.imdb.com/title/${ttid}/`);
    
    if (response.statusCode != 200) return null;
    
    const $ = cheerio.load(response.body, {xmlMode: true});
    const script = $('script[type="application/ld+json"]');
    if (!script) return null;

    const data = JSON.parse(($('script[type="application/ld+json"]')[0].children[0] as any).data);
    
    return {
      id: ttid,
      name: data.name,
      description: data.description,
      poster: data.image,
      posterShape: 'regular',
      type: data['@type'] === 'Movie' ? 'movie' : 'series'
    };
  } catch (err) {
    if (process.env.NODE_ENV === 'development')
      console.error(err);
    return null;
  }
}