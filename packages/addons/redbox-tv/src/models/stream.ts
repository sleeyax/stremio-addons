import RedboxTvApiWrapper, { RedboxTvApi } from "../api";

export default class RedBoxStream {
    constructor(
        public id: number, 
        public mediaUrl: string, 
        public type: number
    ) {}

    async getM3u8Playlist() {
        let data: [string, string, (string, number) => {}];
        let fixToken: (token: string, tokenLen: number) => string;

        switch (this.type) {
            case 38:
                fixToken = (token: string, tokenLen: number) => 
                    [
                        token.substring(0, tokenLen - 59),
                        token.substring(tokenLen - 58, tokenLen - 52),
                        token.substring(tokenLen - 51, tokenLen - 43),
                        token.substring(tokenLen - 42, tokenLen - 34),
                        token.substring(tokenLen - 33),
                    ].join('');
                data = ['http://51.15.209.90:8800/fio/3b.rbt/', 'eWFyYXBuYWthYW1rYXJvOnR1bmduYWtpYWthcm8=', fixToken];
                break;
            case 48:
                fixToken = (token: string, tokenLen: number) => {
                    const now = new Date();
                    const splitted = token.split('');
                    // _in.pop(len(_in) + 2 - 3 - int(str(now.year)[:2]))
                    splitted.splice(splitted.length + 2 - 3 - Number.parseInt(`${now.getFullYear()}`.substring(0, 2)), 1);
                    // _in.pop(len(_in) + 3 - 4 - int(str(now.year)[2:]))
                    splitted.splice(splitted.length + 3 - 4 - Number.parseInt(`${now.getFullYear()}`.substring(2)), 1);
                    // _in.pop(len(_in) + 4 - 5 - (now.month - 1 + 1 + 10))
                    splitted.splice(splitted.length + 4 - 5 - ((now.getMonth() + 1) - 1 + 1 + 10), 1);
                    // _in.pop(len(_in) + 5 - 6 - now.day)
                    splitted.splice(splitted.length + 5 - 6 - now.getDate(), 1);
                    return splitted.join('');
                };
                data = ['http://51.15.209.90:8800/cip/4c.rbt/', 'QDA3NzEyMSM6QDA3NzEyMSM=', fixToken];
                break;
            default:
                // console.log(this.mediaUrl);
                // TODO: other types (0, 18, 21, ...)
                throw new Error('unsupported type ' + this.type);
        }

        const [url, auth, fixTokenCb] = data;

        const token = await RedboxTvApi.getToken(url, auth);

        return `${this.mediaUrl}?wmsAuthSign=${fixTokenCb(token, token.split('').length)}`;
    }
}