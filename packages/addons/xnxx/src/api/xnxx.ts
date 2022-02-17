import needle, { NeedleOptions } from 'needle';
import dotenv from 'dotenv';
dotenv.config();
import cheerio from 'cheerio';
import m3u8 from 'm3u8-reader';
import Category from '../models/category';
import Video from '../models/video';
import VideoSource, { VideoQuality } from '../models/vide_source';

export default class XnxxApi {
    // minimum amount of videos that should be scraped per skip
    readonly vidsPerPage = 50;
    private readonly url = 'https://www.xnxx.com';
    private readonly headers = {
        'User-Agent': 'Stremio Client'
    };

    private get(endpoint: string, proxy?: string) {
        let options: NeedleOptions = {
            headers: this.headers, 
            follow_max: 3,
        };

        if (proxy) {
            options.proxy = proxy;
            options.headers['proxy-type'] = 'all';
        }

        return needle('get', `${this.url}${endpoint}`, options)
            .then(response => {
                if (Buffer.isBuffer(response.body))
                    response.body = response.body.toString();
                return response;
            });
    }
    
    /**
     * Get the top categories from the homepage
     */
    async getTopCategories(): Promise<Category[]> {
        const response = await this.get('/');
        const $ = cheerio.load(response.body);

        return $('p.title a[href*="top"]').map((_, element) => (<Category>{
            endpoint: $(element).attr('href').split('&')[0].replace('?top', ''),
            name: $(element).attr('title')
        })).get();
    }

    private getCurrentDateFormatted(): string {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();

        if (month == 0) {
            year -= 1;
            month = 12;
        }

        return `${year}-${month > 9 ? month : '0' + month}`
    }

    /**
     * Get general categories
     */
    getCategories(): Category[] {
        return [
            {
                name: 'Today\'s selection',
                endpoint: '/todays-selection'
            },
            {
                name: 'Best of',
                endpoint: `/best/${this.getCurrentDateFormatted()}`
            },
            {
                name: 'Hits',
                endpoint: '/hits'
            }
        ];
    }

    async getAllCategories() {
        return [
            ...this.getCategories(),
            ...(await this.getTopCategories())
        ];
    }

    /**
     * Get all videos of specified tag
     * @param tag target endpoint
     * @param page 
     * @param prevVideos list of videos from a previous page (that will be concatinated with the results of this page)
     */
    async getVideos(tag: string, page?: number, prevVideos: Video[] = []): Promise<Video[]> {
        const response = await this.get(`${tag}/${page || ''}`);
        const $ = cheerio.load(response.body);
        
        let videos = $('div.mozaique > div.thumb-block').map((_, element) => {
            const thumbnailElement = $(element).find('.thumb-inside > .thumb > a');
            const detailsElement = $(element).find('.thumb-under');
            const metaElement = $(detailsElement).find('.metadata');

            return <Video>{
                thumbnail: thumbnailElement.find('img').attr('data-src').replace('THUMBNUM', '24'), // (THUMBNUM == the frame number of a part of the vid to show as thumbnail)
                endpoint: thumbnailElement.attr('href'),
                title: detailsElement.find('a').attr('title'),
                duration: metaElement[0].childNodes[1].nodeValue.trim(),
                views: metaElement.find('.right').text().split(' ')[0].trim(),
                quality: metaElement.find('.video-hd')[0].childNodes[1].nodeValue.trim(),
                rating: metaElement.find('.right > .superfluous').text(),
            };
        }).get();

        // append videos from previous page to the videos of this page
        videos = [...prevVideos, ...videos];

        // continue fetching videos if the minimum amount of videos are not scraped yet
        if (videos.length < this.vidsPerPage) {
            const nextPage = (page || 0) + 1;
            // check if the next page exists
            if ($(`.pagination a[href="${tag}/${nextPage}"]`).length > 0 || $(`.pagination a[href="${tag}/${nextPage}/"]`).length > 0)
                videos = await this.getVideos(tag, nextPage, videos);
        }

        return videos;
    }
    
    async getVideoDetails(endpoint: string) {
        const response = await this.get(endpoint);
        const $ = cheerio.load(response.body);

        const metaData = $('.clear-infobar > .metadata').text().split('-');
        const votes = $('#video-votes');

        return <Video> {
            title: $('.clear-infobar > strong').text(),
            duration: metaData[0] ? metaData[0].trim() : undefined,
            quality: metaData[1] ? metaData[1].trim() : undefined,
            views: (metaData[2] || '0').trim(),
            rating: votes.find('.rating-box').text(),
            likes: Number.parseInt(votes.find('.vote-action-good .value').text()) || undefined,
            dislikes: Number.parseInt(votes.find('.vote-action-bad .value').text()) || undefined,
            tags: $('div.video-tags a').map((_, tagElement) => $(tagElement).text()).get(),
            endpoint: $('input#copy-video-link').val().replace(/\bhttp\b/g, 'https').replace(this.url, ''),
            thumbnail: this.readWebPlayerConfig(response.body, 'setThumbUrl'),
            thumbSlide: this.readWebPlayerConfig(response.body, 'setThumbSlide'),
            description: $('.video-description').text().trim() || undefined
        };
    }

    /**
     * Get supported qualities from given M3U8 playlist url
     * @param playlistUrl
     */
    private async parseVideoQualities(playlistUrl: string) {
        // get m3u8 playlist
        const response = await needle('get', playlistUrl);

        // parse available resolutions
        const qualities: string[] = m3u8(response.body).filter(item => typeof(item) === 'string');

        return qualities.map(quality => {
            let resolution = quality.split('-')[1];
            resolution = resolution.substr(0, resolution.indexOf('p')) + 'p';

            return <VideoQuality>{
                quality: resolution,
                sourceUrl: playlistUrl.substring(0, playlistUrl.indexOf('hls.m3u8')) + quality
            }
        });
    }

    /**
     * Read values from xnxx's html5 web player config
     * @param source source html page
     * @param value config value to retrieve
     */
    private readWebPlayerConfig(source: string, value: string) {
        return (new RegExp(`html5player\\.${value}\\('(.+?)'\\)`, 'gm').exec(source) || [])[1];
    }

    /**
     * Returns all available qualities & resolutions of a given video
     * @param endpoint 
     */
    async getVideoSources(endpoint: string) {
        const response = await this.get(endpoint, process.env.PROXY);
        
        const hlsUrl = this.readWebPlayerConfig(response.body, 'setVideoHLS');

        return <VideoSource>{
            externalUrl: `${this.url}${endpoint}`,
            mp4Low: this.readWebPlayerConfig(response.body, 'setVideoUrlLow'),
            mp4High:this.readWebPlayerConfig(response.body, 'setVideoUrlHigh'),
            hlsAuto: hlsUrl,
            qualities: hlsUrl && await this.parseVideoQualities(hlsUrl)
        };
    }

    searchVideos(query: string) {
        return this.getVideos('/search/' + query.split(' ').join('+'));
    }
}