const {getRouter} = require('stremio-addon-sdk');
const addonInterface = require('./addon');
const landingTemplate = require('stremio-addon-sdk/src/landingTemplate');
const manifest = require('./manifest');

const router = getRouter(addonInterface);
const landingHTML = landingTemplate(manifest);

module.exports = function (req, res) {
    router.get("/", (_, res) => {
        res.setHeader('content-type', 'text/html');
        res.end(landingHTML);
    });

    router(req, res, () => {
        res.statusCode = 404;
        res.end();
    });
};
