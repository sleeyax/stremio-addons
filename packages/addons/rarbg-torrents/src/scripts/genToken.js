require('dotenv').config();
const TorrentApi = require('../torrentapi');

TorrentApi.getToken()
    .then(resp => console.log('Token: ' + resp.token))
    .catch(err => console.log(err));
