import needle, { NeedleHttpVerbs, head } from 'needle';
import cheerio from 'cheerio';
import Category from './category';

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
            endpoint: $(element).attr('href'),
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
                endpoint: '/today-selection'
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

    getVideos(endpoint: string) {
        return [];
    }
}