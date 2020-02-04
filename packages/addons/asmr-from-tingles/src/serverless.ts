import addonInit from './addon';
import { getRouter } from 'stremio-addon-sdk';
import landingTemplate from 'stremio-addon-sdk/src/landingTemplate';

module.exports = (req, res) => {
    addonInit().then((addonInterface) => {
        const router = getRouter(addonInterface);
        const landingHTML = landingTemplate(addonInterface.manifest);

        router.get("/", (_, res) => {
            res.setHeader('content-type', 'text/html');
            res.end(landingHTML);
        });

        router(req, res, () => {
            res.statusCode = 404;
            res.end();
        });
    });
};