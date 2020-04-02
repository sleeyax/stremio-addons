import needle, { NeedleHttpVerbs, head } from 'needle';
import cheerio from 'cheerio';
import Category from './category';
import Video from './video';

export default class XnxxApi {
    private readonly url = 'https://www.xnxx.com';
    private readonly headers = {
        'User-Agent': 'Stremio Client'
    };

    private get(endpoint: string) {
        return needle('get', `${this.url}${endpoint}`, { headers: this.headers });
    }
    
    /**
     * Get the top categories from the homepage
     */
    async getTopCategories() {
        const response = await this.get('/');
        const $ = cheerio.load(response.body);

        const categories: Category[] = [];
        $('p.title a[href*="top"]').each((_, element) => categories.push({
            endpoint: $(element).attr('href').split('&')[0].replace('?top', ''),
            name: $(element).attr('title')
        }));

        return categories;
    }

     private getCurrentDateFormatted(): string {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() - 1;

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
     */
    async getVideos(tag: string, page?: number) {
        const response = await this.get(`${tag}/${page || ''}`);
        const $ = cheerio.load(response.body);
        
        return $('div.mozaique > div.thumb-block').map((_, element) => {
            const thumbnailElement = $(element).find('.thumb-inside a');
            const detailsElement = $(element).find('.thumb-under');
            const metaElement = $(detailsElement).find('.metadata');

            return <Video>{
                id: thumbnailElement.find('img').attr('data-videoid'),
                thumbnail: thumbnailElement.find('img').attr('src'),
                endpoint: thumbnailElement.attr('href'),
                title: detailsElement.find('a').attr('title'),
                duration: metaElement.text().trim().split('\n')[1],
                views: metaElement.find('.right').text().split(' ')[0].trim(),
                quality: metaElement.find('.video-hd').text().split('-')[1].trim(),
                watchTime: metaElement.find('.right > .superfluous').text(),
            };
        }).get();
    }
}