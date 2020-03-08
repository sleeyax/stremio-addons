import supportedAddons, { SupportedAddon } from "./supported";
import needle from 'needle';
import { resolveAllPromises } from "./helpers";

class Command {
    static readonly PREFIX = '!qs';
    sourceAddons: SupportedAddon[];
    searchQuery: string;
    filter: string;

    constructor(command: string) {
        command = command.replace(Command.PREFIX + ' ', '');
        
        const {params, query} = this.extractParts(command);
        
        this.searchQuery = query;

        const splitted = params.split(' ');

        if (splitted.length == 0) {
            // TODO: no params specified -> search all sources
        } else {
            // target source e.g rarbg,1337x
            const sources = splitted[0].split(',');
            const addons = supportedAddons.filter(addon => sources.includes(addon.name));
            if (addons.length > 0)
                this.sourceAddons = addons;    

            // filters e.g movie,series
            if (splitted.length == 2)
                this.filter = splitted[1];
        }
    }

    private extractParts(command: string) {
        // split into params and query
        let splitted = command.split(command.indexOf("'") > -1 ? "'" : '"', 2);
        if (splitted.length != 2)
            throw new Error('Search query not found!');
        
        // trim whitespaces
        splitted = splitted.map(split => split.trim());

        return {
            params: splitted[0] || null,
            query: splitted[1]
        };
    }
    
    private search(opts: {
        addonUrl: string,
        query: string,
        filter?: string
    }) {
        return needle('get', `${opts.addonUrl}/qsearch/${opts.filter || 'all'}/${opts.query}.json`)
            .then(res => res.body);
    }

    execute() {
        const promises = this.sourceAddons.map(addon => this.search({
            addonUrl:  addon.url,
            query: this.searchQuery,
            filter: this.filter
        }));

        return resolveAllPromises(promises).then(results => results.flat());
    }

}



export default Command;
