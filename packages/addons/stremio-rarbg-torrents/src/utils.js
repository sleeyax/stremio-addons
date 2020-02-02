const torrentParser = require('parse-torrent');

function toHomanReadable(bytes) {
    if (Math.abs(bytes) < 1024) { return bytes + ' B'; }

    const units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];

    let i = -1;
    do {
        bytes /= 1024;
        ++i;
    } while(Math.abs(bytes) >= 1024 && i < units.length - 1);

    return bytes.toFixed(1) +" " + units[i];
}

function is4k(str) {
    str = str.toLowerCase();
    return str.indexOf("2160p") !== -1 || str.indexOf("4k") !== -1 || str.indexOf("uhd") !== -1;
}

module.exports = {
    toStream: (torrentResults) => {
        return torrentResults.map(result => {
            const torrent = torrentParser(result.download);
            return {
                name: is4k(result.category) ? 'RARBG-4K' : 'RARBG',
                title: `${result.title}, C: ${result.category}, S: ${result.seeders} L: ${result.leechers}, size: ${toHomanReadable(result.size)}`,
                infoHash: torrent.infoHash
            };
        });
    },
    nrOfDays: (nr) => nr * (24 * 3600),
    delay: (t, v) => {
        return new Promise(function(resolve) {
            setTimeout(resolve.bind(null, v), t)
        });
    },
    toZeroPaddedNumber: (num) => {
        return num <= 9 ? '0' + num : num;
    },
    genRandomString: (min = 5, max = 10) => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const random = Math.floor(Math.random() * max) + min;
        let result = "";
        for (let i=0; i<=random; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};
