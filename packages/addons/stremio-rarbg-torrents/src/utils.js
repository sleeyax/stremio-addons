const torrentParser = require('parse-torrent');

module.exports = {
    toStream: (torrentResults) => {
        return torrentResults.torrent_results.map(result => {
            const torrent = torrentParser(result.download);
            return {
                name: 'RARBG',
                title: `${result.title}, C: ${result.category}, S: ${result.seeders}, L: ${result.leechers}`,
                infoHash: torrent.infoHash
            };
        });
    },
    toZeroPaddedNumber: (num) => {
        return num <= 9 ? '0' + num : num;
    }
};
