const {getRouter} = require("stremio-addon-sdk");
const addonInterface = require("./addon");
const landingTemplate = require('stremio-addon-sdk/src/landingTemplate');

const router = getRouter(addonInterface);

const landingHTML = landingTemplate(addonInterface.manifest);
router.get("/", (_, res) => {
    res.setHeader('content-type', 'text/html');
    res.end(landingHTML);
});

module.exports = function(req, res) {
     router(req, res, () => {
        res.statusCode = 404;
        res.end();
    });
};
