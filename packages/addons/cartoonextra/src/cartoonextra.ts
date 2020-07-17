import got, { Got } from 'got';
import cheerio from 'cheerio';
import Show from './models/show';

export default class CartoonExtra {
  private httpClient: Got;
  private prefixUrl: string;

  constructor() {
    this.prefixUrl = 'http://cartoonextra.in/';
    this.httpClient = got.extend({
      allowGetBody: true,
      decompress: true,
      prefixUrl: this.prefixUrl,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en,nl;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36'
      }
    });
  }

  /**
   * Parses the number of episodes of given 'episodes published' string
   * Exmaple input: '255 Episode(s) Published'
   * Example Output: 255
   * @param episodesPublished 
   */
  private parseEpisodes(episodesPublished: string) {
    const regex = /(\d+)/;
    const matches = regex.exec(episodesPublished);
    return matches != null ? Number.parseInt(matches[1]) : 0;
  }

  /**
   * Parses the year of given released string
   * Exmaple input: Released: 2010 
   * Example output: 2010
   * @param released 
   */
  private parseReleaseYear(released: string) {
    const splitted = released.split(':');
    return Number.parseInt(splitted[1].trim());
  }

  /**
   * Search shows
   * @param query 
   */
  async search(query: string): Promise<Show[]> {
    const response = await this.httpClient.get(`toon/search?key=${query.replace(' ', '+')}`);
    const $ = cheerio.load(response.body);

    return $('.cartoon-box').map((_, cartoonBox) => new Show({
      title: $(cartoonBox).find('h3 > a').text(),
      thumbnail: $(cartoonBox).find('a > img').attr('src'),
      episodes: this.parseEpisodes($($(cartoonBox).find('div.detail')[0]).text()),
      isOngoing: $($(cartoonBox).find('div.detail')[1]).text().toLowerCase().indexOf('ongoing') >= -1,
      releaseYear: this.parseReleaseYear($($(cartoonBox).find('div.detail')[2]).text()),
      url: $(cartoonBox).find('h3 > a').attr('href')
    })).get();
  }

  /**
   * Get a list of episode urls
   * @param showUrl full url to the show or just the slug
   * @param page number of the page to scrape
   */
  async getEpisodes(showUrl: string, page = 1): Promise<string[]> {
    if (!showUrl.startsWith('http'))
      showUrl = `${this.prefixUrl}/${showUrl}`;

    const response = await this.httpClient.get(`${showUrl}?page=${page}`, { prefixUrl: undefined });
    const $ = cheerio.load(response.body);

    return $('#list a').map((_, elem) => $(elem).attr('href')).get();
  }

  /**
   * Extract inner video of given video player url
   * @param playerUrl 
   */
  private async extractSourceVideo(playerUrl: string) {
    const response = await this.httpClient.get(playerUrl, {
      prefixUrl: undefined,
      followRedirect: true
    });

    // extract source mp4 file from video player
    const regex = /file: "(.+)"/gm;
    const matches = regex.exec(response.body);
    if (matches == null)
      return null;

    return matches[1];
  }

  async getStreams(episode: string): Promise<string[]> {
    const result = [];

    let i = 1;
    let serverCount;
    
    do {
      const response = await this.httpClient.get(`${episode}?version=${i}`);
      const $ = cheerio.load(response.body);
      serverCount = $('ul.list-episode li').length;
     
      const playerUrl = $('.stream > iframe').attr('src');

      const sourceUrl = await this.extractSourceVideo(playerUrl);
      
      // filter malfunctioning or duplicate streams
      if(sourceUrl != null && result.indexOf(sourceUrl) == -1)
        result.push(sourceUrl);

      i++;
    } while(i <= serverCount);

    return result;
  }
}