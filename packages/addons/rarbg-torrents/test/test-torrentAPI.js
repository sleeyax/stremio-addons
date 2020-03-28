const TorrentAPI = require('../src/torrentapi');
const torrentApi = new TorrentAPI();

torrentApi.getList()
    .then(res => console.log(res))
    .catch(err => console.log(err));
