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

module.exports = {
    toStream: (torrentResults) => {
        return torrentResults.torrent_results.map(result => {
            const torrent = torrentParser(result.download);
            return {
                name: 'RARBG',
                title: `${result.title}, C: ${result.category}, S: ${result.seeders} L: ${result.leechers}, size: ${toHomanReadable(result.size)}`,
                infoHash: torrent.infoHash
            };
        });
    },
    toZeroPaddedNumber: (num) => {
        return num <= 9 ? '0' + num : num;
    },
};
