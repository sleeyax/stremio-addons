import RedboxTvApiWrapper, { RedboxTvApi } from "../api";

export default class RedBoxStream {
    constructor(
        public id: number, 
        public mediaUrl: string, 
        public type: number
    ) {}

    async getM3u8Playlist() {
        let data: [string, string, (string, number) => {}];

        switch (this.type) {
            case 38:
                const fixToken = (token: string, tokenLen: number) => 
                    [
                        token.substring(0, tokenLen - 59),
                        token.substring(tokenLen - 58, tokenLen - 52),
                        token.substring(tokenLen - 51, tokenLen - 43),
                        token.substring(tokenLen - 42, tokenLen - 34),
                        token.substring(tokenLen - 33),
                    ].join('');
                data = ['http://51.15.209.90:8800/fio/3b.rbt/', 'eWFyYXBuYWthYW1rYXJvOnR1bmduYWtpYWthcm8=', fixToken];
                break;
            default:
                throw new Error('unsupported type ' + this.type);
        }

        const [url, auth, fixTokenCb] = data;

        const token = await RedboxTvApi.getToken(url, auth);

        return `${this.mediaUrl}?wmsAuthSign=${fixTokenCb(token, token.split('').length)}`;
    }
}