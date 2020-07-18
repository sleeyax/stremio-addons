import got, { Got } from 'got';
import cheerio from 'cheerio';
import safeEval from 'notevil';
import urlLib from 'url';
import querystring from 'querystring';

interface VideoSource {
  cdn: string;
  enc: string;
  hd: string;
  server: string;
}

export default class WatchCartoonOnline {
  private httpClient: Got;
  private url: string;

  constructor() {
    this.url = 'https://www.thewatchcartoononline.tv';
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

  private async getVideoSource(params: { fileName: string, embed: string, hd: string }): Promise<VideoSource> {
    const response = await this.httpClient.get(`inc/embed/getvidlink.php?v=${params.embed}/${params.fileName}&embed=${params.embed}&hd=${params.hd}`, {
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      },
      responseType: 'json'
    });

    return response.body as VideoSource;
  }

  async getVideo(slug: string) {
    const response = await this.httpClient.get(slug);
    let $ = cheerio.load(response.body);

    // the actual video file name is hidden in some obfuscated javascript
    // so we have to decode that to readable HTML first
    const challengeJs = $('#hide-cizgi-video-0').next().html().trim();
    const decodedHtml = this.decodeJavascriptChallenge(challengeJs);
    $ = cheerio.load(decodedHtml);

    // extract file details from iframe source url
    const iframeSrc = $('iframe').attr('src');
    const url = urlLib.parse(`${this.url}${iframeSrc}`);
    const params: { [key: string]: string; } = querystring.parse(url.query) as { [key: string]: string; };

    // fially, get the video source
    const videoSource = await this.getVideoSource({
      fileName: params.file.replace('.flv', '.mp4'),
      embed: params.embed,
      hd: params.hd
    });

    return {
      'HD': `${videoSource.cdn}/getvid?evid=${videoSource.hd}`,
      'SD': `${videoSource.cdn}/getvid?evid=${videoSource.enc}`
    };
  }
}