import needle = require("needle");
import RedBox from "./models/redbox";
import Category from "./models/category";
import Channel from "./models/channel";
import RedBoxStream from "./models/stream";

export class RedboxTvApi {
    private static createModified(modified: number) {
        // get current time since epoch in seconds
        const secs = Math.round(new Date().getTime() / 1000);
        const time = secs ^ modified;
        const timeChars = `${time}`.split('');
        
        return `${timeChars[0]}0${timeChars[1]}1${timeChars[2]}2${timeChars[3]}3${timeChars[4]}4${timeChars[5]}5${timeChars[6]}6${timeChars[7]}7${timeChars[8]}8${timeChars[9]}9`;
    }

    /**
     * Retreive stream token
     * @param url target url
     * @param auth bearer authentication credentials
     */
    static getToken(url, auth): Promise<string> {
        const modified = this.createModified(6154838);
        const headers = {
            'Authorization': 'Basic ' + auth,
            'User-Agent': 'Dalvik/1.6.0 (Linux; U; Android 4.4.2; SM-N935F Build/JLS36C)',
            'Modified': modified,
            'Accept-Encoding': 'gzip',
            'Connection': 'Keep-Alive'
        };

        return needle('get', url, {headers})
            .then(res => res.body.replace('?wmsAuthSign=', ''));
    }


    /**
     * Load RedBox data
     * This method fetches all channels & categories
     */
    load(): Promise<any> {
        const headers = {
            'Referer': 'http://welcome.com/',
            'Authorization': 'Basic aGVsbG9NRjpGdWNrb2Zm',
            'User-Agent': 'Dalvik/1.6.0 (Linux; U; Android 4.4.2; SM-N935F Build/JLS36C)',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept-Encoding': 'gzip'
        };
        const data = { check: 1, user_id: 3010064, version: 32 };
        
        return needle('post', 'http://163.172.111.138:8030/rbtv/i/redbox.tv/', data, {headers, json: false})
            .then(response => JSON.parse(response.body));
    }
}

export default class RedboxTvApiWrapper {
    private api: RedboxTvApi;

    constructor() {
        this.api = new RedboxTvApi();
    }

    private decode(value: string, sliceEnd?: boolean): string {
        value = sliceEnd ? value.slice(0, -1) : value.slice(1);
        return Buffer.from(value, 'base64').toString();
    }

    /**
     * Convert json response data to `Category`
     * @param json 
     */
    private readCategory(json: any) {
        return <Category>{
            id: json['cat_id'],
            name: json['cat_name']
        };
    }

    /**
     * Convert json response data to Channel
     * @param json
     */
    private readChannel(json: any): Channel {
        return <Channel><unknown>{
            id: this.decode(json['rY19pZA=='], true),
            name: this.decode(json['ZY19uYW1l'], true),
            iconUrl: this.decode(json['abG9nb191cmw='], false),
            category: this.readCategory(json),
            streams: json['Qc3RyZWFtX2xpc3Q='].map(stream => new RedBoxStream(
                Number.parseInt(this.decode(stream['cc3RyZWFtX2lk'], true)),
                this.decode(stream['Bc3RyZWFtX3VybA=='], false),
                Number.parseInt(this.decode(stream['AdG9rZW4='], true))
            ))
        };
    }

    /**
     * Returns a box of channels & categories
     */
    getBox(): Promise<RedBox> {
        const channels = 'eY2hhbm5lbHNfbGlzdA==';
        return this.api.load()
            .then(json => new RedBox(
                json['categories_list'].map(cat => this.readCategory(cat)), 
                json[channels].map(chan => this.readChannel(chan))
            ));
    }
}