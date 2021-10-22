import got, { Got } from 'got';
import cheerio from 'cheerio';
import safeEval from 'notevil';
import urlLib from 'url';
import querystring from 'querystring';

interface VideoHost {
  /**
   * direct CDN where the video is hosted
   */
  cdn: string;
  /**
   * SD
   */
  enc: string;
  /**
   * HD
   */
  hd: string;
  /**
   * indirect server where the video comes from
   */
  server: string;
}

interface Source {
  quality: 'HD' | 'SD';
  url: string;
}

interface Video {
  /**
   * full name of the video file
   */
  fileName: string;
  sources: Source[];
}

type ParsedQuery = { [key: string]: string; };

export default class WatchCartoonOnline {
  private httpClient: Got;
  private url: string;

  constructor() {
    this.url = 'https://www.wcofun.com';
    this.httpClient = got.extend({
      prefixUrl: this.url + '/',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        // NOTE: user agent should match up with the one Stremio sends, 
        // otherwise the response will result in a 404 not found
        'User-Agent': 'libmpv'
      },
      decompress: true,
      followRedirect: true
    });
  }

  private decodeJavascriptChallenge(challengeJs: string) {
    const $ = cheerio.load(challengeJs);

    let decodedHtml;
    safeEval(challengeJs, {
      atob: (value) => Buffer.from(value, 'base64').toString('ascii'),
      document: {
        write: (value: string) => decodedHtml = value,
      },
      parseInt,
      escape,
      decodeURIComponent
    });

    return decodedHtml;
  }

  private async getVideoHost(params: { fileName: string, embed: string, hd: string }): Promise<VideoHost> {
    const response = await this.httpClient.get(`inc/embed/getvidlink.php?v=${params.embed == 'cizgi' ? params.embed + '/' : ''}${params.fileName}&embed=${params.embed}&hd=${params.hd}`, {
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      },
      responseType: 'json'
    });

    return response.body as VideoHost;
  }

  private readVideoSources(videoHost: VideoHost) {
    const sources: Source[] = [];

    if (videoHost.hd != '')
      sources.push({
        quality: 'HD',
        url: `${videoHost.cdn}/getvid?evid=${videoHost.hd}`,
      });
    if (videoHost.enc != '')
      sources.push({
        quality: 'SD',
        url: `${videoHost.cdn}/getvid?evid=${videoHost.enc}`
      });

    return sources;
  }

  async getVideos(slug: string) {
    const response = await this.httpClient.get(slug);
    let $ = cheerio.load(response.body);

    // the actual iframes containg the video(s) are hidden in some obfuscated javascript
    // so we have to decode that to readable HTML first
    // (each challenge contains 1 iframe - containing 1 video - when solved)
    const jsChallenges: string[] = $('[id*=-video-]').next().map((_, el) => $(el).html().trim()).get();
    const videos: Video[] = [];
    for (const challenge of jsChallenges) {
      const decodedHtml = this.decodeJavascriptChallenge(challenge);
      $ = cheerio.load(decodedHtml);

      // extract file details from the iframe source url on the page
      const iframeSrc = $('iframe').attr('src');

      const url = urlLib.parse(`${this.url}${iframeSrc}`);
      const params: ParsedQuery = querystring.parse(url.query) as ParsedQuery;

      // finally, get the actual video source
      const fileName = params.file.replace('.flv', '.mp4');
      const videoHost = await this.getVideoHost({
        fileName,
        embed: params.embed,
        hd: params.hd
      });

      videos.push({
        fileName,
        sources: this.readVideoSources(videoHost)
      });
    };

    return videos;
  }
}